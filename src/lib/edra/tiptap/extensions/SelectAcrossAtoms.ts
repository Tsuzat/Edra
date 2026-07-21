import { Extension } from '@tiptap/core';
import { NodeSelection, Plugin, PluginKey, Selection, TextSelection } from '@tiptap/pm/state';
import { Decoration, DecorationSet, type EditorView } from '@tiptap/pm/view';
import type { Node as ProseMirrorNode, ResolvedPos } from '@tiptap/pm/model';

const selectAcrossAtomsKey = new PluginKey('selectAcrossAtoms');

/** Penetration depth below this threshold is treated as a "slight graze" and won't be merged into the selection */
export const ATOM_SLIGHT_PENETRATION_PX = 12;

/**
 * Returns the effective penetration threshold for a given atom element,
 * clamped to the atom's dimensions. This prevents small atoms (whose
 * smaller dimension is below ~24px) from never reaching the fixed threshold.
 */
export function effectivePenetrationThreshold(rect: DOMRectReadOnly): number {
	const maxPossible = Math.min(rect.width, rect.height) / 2;
	return Math.min(ATOM_SLIGHT_PENETRATION_PX, maxPossible);
}

export type AtomVerticalSide = 'above' | 'below';

/** Block-level leaf / atom: should be merged as a whole block into TextSelection during drag-selection */
function isAcrossSelectableNode(node: ProseMirrorNode): boolean {
	if (node.isText) return false;
	if (node.type.name === 'image') return true;
	if (node.type.name === 'blockMath' || node.type.name === 'inlineMath') return true;
	if (node.type.name === 'video' || node.type.name === 'audio' || node.type.name === 'iframe') {
		return true;
	}
	return node.isAtom && (node.isLeaf || !node.type.inlineContent);
}

/**
 * Construct a TextSelection covering [nodeStart, nodeEnd) while preserving the original anchor.
 * Cannot simply use TextSelection.between(anchor, nodeEnd) because nodeEnd is often in a doc gap,
 * and `between` would pull the head back before the image/formula, preventing the node from being
 * truly included in the selection.
 */
export function selectionCoveringNode(
	doc: ProseMirrorNode,
	anchor: number,
	nodeStart: number,
	nodeEnd: number
): TextSelection {
	const forward = anchor <= nodeStart;
	const edge = forward ? nodeEnd : nodeStart;
	const bias = forward ? 1 : -1;
	const found = Selection.findFrom(doc.resolve(edge), bias, true);

	if (found) {
		const next = TextSelection.between(doc.resolve(anchor), found.$head);
		if (next instanceof TextSelection && next.from <= nodeStart && next.to >= nodeEnd) {
			return next;
		}
	}

	const from = Math.min(anchor, nodeStart);
	const to = Math.max(anchor, nodeEnd);
	return TextSelection.create(doc, from, to);
}

/** Mouse penetration depth relative to an element (distance to nearest edge); 0 if outside */
export function atomPenetrationDepth(
	clientX: number,
	clientY: number,
	rect: DOMRectReadOnly
): number {
	if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
		return 0;
	}
	return Math.min(
		clientX - rect.left,
		rect.right - clientX,
		clientY - rect.top,
		rect.bottom - clientY
	);
}

/** Determine whether the drag-selection enters the atom node from above or below, based on selection position */
export function entrySideFromSelection(
	sel: Selection,
	nodeStart: number,
	nodeEnd: number
): AtomVerticalSide | null {
	const from = Math.min(sel.anchor, sel.head);
	const to = Math.max(sel.anchor, sel.head);
	if (to <= nodeStart) return 'above';
	if (from >= nodeEnd) return 'below';
	// Already spanning the node: use the side where the anchor is
	if (sel.anchor <= nodeStart) return 'above';
	if (sel.anchor >= nodeEnd) return 'below';
	return null;
}

/** Determine the exit side based on the pointer position relative to the node's bounding rect when leaving */
export function leaveSideFromPoint(clientY: number, rect: DOMRectReadOnly): AtomVerticalSide {
	const mid = (rect.top + rect.bottom) / 2;
	return clientY < mid ? 'above' : 'below';
}

function clampPosToSide(
	doc: ProseMirrorNode,
	pos: number,
	nodeStart: number,
	nodeEnd: number,
	side: AtomVerticalSide
): number {
	if (side === 'below') {
		if (pos >= nodeEnd) return pos;
		const found = Selection.findFrom(doc.resolve(nodeEnd), 1, true);
		return found?.from ?? nodeEnd;
	}
	if (pos <= nodeStart) return pos;
	const found = Selection.findFrom(doc.resolve(nodeStart), -1, true);
	return found?.from ?? nodeStart;
}

/** Merge an atom node into the current drag TextSelection (preserving the anchor) */
export function includeAtomInDragSelection(
	view: EditorView,
	nodeStart: number,
	nodeEnd: number
): boolean {
	const { state } = view;
	const sel = state.selection;

	if (sel instanceof NodeSelection) return false;
	if (sel.empty) return false;
	if (sel.from <= nodeStart && sel.to >= nodeEnd) return true;

	try {
		const next = selectionCoveringNode(state.doc, sel.anchor, nodeStart, nodeEnd);
		if (!sel.eq(next)) {
			view.dispatch(state.tr.setSelection(next).setMeta('addToHistory', false));
		}
		return true;
	} catch {
		return false;
	}
}

/**
 * Exclude an atom node from the selection, pulling the selection back to the specified side
 * (retracting after accidentally entering). savedAnchor is the anchor before entry, used to
 * restore the original selection intent as closely as possible.
 */
export function excludeAtomFromDragSelection(
	view: EditorView,
	nodeStart: number,
	nodeEnd: number,
	side: AtomVerticalSide,
	savedAnchor: number,
	clientX: number,
	clientY: number
): boolean {
	const { state } = view;
	const sel = state.selection;
	if (sel instanceof NodeSelection || sel.empty) return false;

	const posInfo = view.posAtCoords({ left: clientX, top: clientY });
	const rawHead = posInfo?.pos ?? savedAnchor;
	const anchor = clampPosToSide(state.doc, savedAnchor, nodeStart, nodeEnd, side);
	const head = clampPosToSide(state.doc, rawHead, nodeStart, nodeEnd, side);

	try {
		const next = TextSelection.between(state.doc.resolve(anchor), state.doc.resolve(head));
		if (!sel.eq(next)) {
			view.dispatch(state.tr.setSelection(next).setMeta('addToHistory', false));
		}
		return true;
	} catch {
		try {
			const next = TextSelection.create(state.doc, anchor, head);
			view.dispatch(state.tr.setSelection(next).setMeta('addToHistory', false));
			return true;
		} catch {
			return false;
		}
	}
}

/**
 * Settle when leaving an atom node: exit on same side → exclude the node; exit on opposite side → keep it included.
 */
export function resolveAtomLeave(
	view: EditorView,
	opts: {
		nodeStart: number;
		nodeEnd: number;
		entrySide: AtomVerticalSide;
		savedAnchor: number;
		included: boolean;
		clientX: number;
		clientY: number;
		rect: DOMRectReadOnly;
	}
): void {
	if (!opts.included) return;

	const leaveSide = leaveSideFromPoint(opts.clientY, opts.rect);
	if (leaveSide === opts.entrySide) {
		excludeAtomFromDragSelection(
			view,
			opts.nodeStart,
			opts.nodeEnd,
			leaveSide,
			opts.savedAnchor,
			opts.clientX,
			opts.clientY
		);
	} else {
		// Crossed to opposite side: selection should include the image
		includeAtomInDragSelection(view, opts.nodeStart, opts.nodeEnd);
	}
}

/**
 * Only match when coordinates fall "inside" the atom node.
 * Avoids using nodeBefore since it can be falsely matched when a paragraph starts right after an image above.
 */
function findAcrossNodeAtPos($pos: ResolvedPos): { pos: number; node: ProseMirrorNode } | null {
	for (let d = $pos.depth; d > 0; d--) {
		const node = $pos.node(d);
		if (isAcrossSelectableNode(node)) {
			return { pos: $pos.before(d), node };
		}
	}

	const nodeAfter = $pos.nodeAfter;
	if (nodeAfter && isAcrossSelectableNode(nodeAfter)) {
		return { pos: $pos.pos, node: nodeAfter };
	}
	return null;
}

function atomHitFromPos(
	view: EditorView,
	pos: number
): { nodeStart: number; nodeEnd: number; dom: Element } | null {
	const hit = findAcrossNodeAtPos(view.state.doc.resolve(pos));
	if (!hit) return null;
	const nodeStart = hit.pos;
	const nodeEnd = nodeStart + hit.node.nodeSize;
	const dom = view.nodeDOM(nodeStart);
	if (!(dom instanceof Element)) return null;
	return { nodeStart, nodeEnd, dom };
}

/**
 * Prefer elementFromPoint to hit NodeView (during drag-selection, posAtCoords often lands in gaps before/after images).
 */
function hitAtomAtCoords(
	view: EditorView,
	clientX: number,
	clientY: number
): { nodeStart: number; nodeEnd: number; dom: Element } | null {
	const el = document.elementFromPoint(clientX, clientY);
	if (el && view.dom.contains(el)) {
		const wrapper =
			el.closest('[data-node-view-wrapper]') ??
			el.closest('.tiptap-mathematics-render') ??
			(el instanceof HTMLImageElement || el instanceof HTMLVideoElement ? el : null);

		if (wrapper && view.dom.contains(wrapper)) {
			try {
				const pos = view.posAtDOM(wrapper, 0);
				const fromDom = atomHitFromPos(view, pos);
				if (fromDom) {
					const rect = fromDom.dom.getBoundingClientRect();
					if (
						clientX >= rect.left &&
						clientX <= rect.right &&
						clientY >= rect.top &&
						clientY <= rect.bottom
					) {
						return fromDom;
					}
				}
			} catch {
				/* posAtDOM failed, fall back */
			}
		}
	}

	const posInfo = view.posAtCoords({ left: clientX, top: clientY });
	if (!posInfo) return null;

	const inside = posInfo.inside >= 0 ? posInfo.inside : posInfo.pos;
	return atomHitFromPos(view, inside);
}

function pointInRect(clientX: number, clientY: number, rect: DOMRectReadOnly): boolean {
	return (
		clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom
	);
}

type AtomVisit = {
	nodeStart: number;
	nodeEnd: number;
	maxPenetration: number;
	included: boolean;
	entrySide: AtomVerticalSide;
	savedAnchor: number;
	dom: Element;
};

type PreservedRange = { anchor: number; head: number };

/** Check if right-click falls within the current non-empty selection (including atoms fully covered by TextSelection) */
function shouldPreserveSelectionOnRightClick(view: EditorView, event: MouseEvent): boolean {
	if (event.button !== 2) return false;
	const sel = view.state.selection;
	if (sel.empty) return false;

	const hit = hitAtomAtCoords(view, event.clientX, event.clientY);
	if (hit && sel.from <= hit.nodeStart && sel.to >= hit.nodeEnd) {
		return true;
	}

	const posInfo = view.posAtCoords({ left: event.clientX, top: event.clientY });
	if (!posInfo) return false;

	const pos = posInfo.inside >= 0 ? posInfo.inside : posInfo.pos;
	return pos >= sel.from && pos <= sel.to;
}

function restorePreservedSelection(view: EditorView, preserved: PreservedRange): void {
	const { state } = view;
	const sel = state.selection;
	if (sel.anchor === preserved.anchor && sel.head === preserved.head) {
		const from = Math.min(preserved.anchor, preserved.head);
		const to = Math.max(preserved.anchor, preserved.head);
		let coversAll = true;
		state.doc.nodesBetween(from, to, (node, pos) => {
			if (!isAcrossSelectableNode(node)) return;
			if (from <= pos && to >= pos + node.nodeSize) {
				if (!(sel.from <= pos && sel.to >= pos + node.nodeSize)) coversAll = false;
			}
		});
		if (coversAll) return;
	}

	try {
		let next: TextSelection = TextSelection.create(state.doc, preserved.anchor, preserved.head);
		const from = Math.min(preserved.anchor, preserved.head);
		const to = Math.max(preserved.anchor, preserved.head);
		state.doc.nodesBetween(from, to, (node, pos) => {
			if (!isAcrossSelectableNode(node)) return;
			const nodeEnd = pos + node.nodeSize;
			if (from <= pos && to >= nodeEnd && !(next.from <= pos && next.to >= nodeEnd)) {
				next = selectionCoveringNode(state.doc, next.anchor, pos, nodeEnd);
			}
		});
		if (!sel.eq(next)) {
			view.dispatch(state.tr.setSelection(next).setMeta('addToHistory', false));
		}
	} catch {
		try {
			const next = TextSelection.between(
				state.doc.resolve(preserved.anchor),
				state.doc.resolve(preserved.head)
			);
			view.dispatch(state.tr.setSelection(next).setMeta('addToHistory', false));
		} catch {
			/* ignore */
		}
	}
}

/**
 * Left-click to select an atom node: posAtCoords.inside on NodeView is often -1,
 * PM's default selectClickedLeaf will fail, so we use DOM hit testing to supplement with NodeSelection.
 */
function selectAtomOnClick(view: EditorView, event: MouseEvent): boolean {
	if (event.button !== 0 || !view.editable) return false;

	const target = event.target;
	if (
		target instanceof Element &&
		target.closest('.resize-handle, .media-toolbar, .more-options-menu, input, button, textarea, a')
	) {
		return false;
	}

	const hit = hitAtomAtCoords(view, event.clientX, event.clientY);
	if (!hit || !pointInRect(event.clientX, event.clientY, hit.dom.getBoundingClientRect())) {
		return false;
	}

	const node = view.state.doc.nodeAt(hit.nodeStart);
	if (!node || !isAcrossSelectableNode(node) || !NodeSelection.isSelectable(node)) {
		return false;
	}

	const sel = view.state.selection;
	if (sel instanceof NodeSelection && sel.from === hit.nodeStart) {
		return true;
	}

	try {
		view.dispatch(
			view.state.tr
				.setSelection(NodeSelection.create(view.state.doc, hit.nodeStart))
				.setMeta('pointer', true)
		);
		return true;
	} catch {
		return false;
	}
}

/**
 * When drag-selecting across atom nodes (images, formulas, etc.), merge the entire block into TextSelection.
 *
 * - Left-click on an atom like image → NodeSelection + selection highlight
 * - Truly entered (sufficient penetration depth) → immediately merge into selection
 * - On leaving: exit on entry side → exclude the image; exit on opposite side → keep it included
 * - Slight edge graze → do not merge
 * - Right-click within selection: preventDefault + restore snapshot, maintaining TextSelection / atom highlight
 */
export const SelectAcrossAtoms = Extension.create({
	name: 'selectAcrossAtoms',

	addProseMirrorPlugins() {
		let dragging = false;
		let visit: AtomVisit | null = null;
		/** Preserve selection on right-click within selection, preventing browser/PM from collapsing it to a cursor or NodeSelection */
		let preservedOnRightClick: PreservedRange | null = null;
		let restoreRaf = 0;
		/** Pointer position when left button is pressed, used to distinguish click-select from drag-select */
		let mouseDownX = 0;
		let mouseDownY = 0;

		const resetVisit = () => {
			visit = null;
		};

		const scheduleRestorePreserved = (view: EditorView) => {
			if (!preservedOnRightClick) return;
			const snap = preservedOnRightClick;
			if (restoreRaf) cancelAnimationFrame(restoreRaf);
			restoreRaf = requestAnimationFrame(() => {
				restoreRaf = 0;
				if (preservedOnRightClick) restorePreservedSelection(view, snap);
			});
		};

		const leaveCurrentVisit = (view: EditorView, clientX: number, clientY: number) => {
			if (!visit) return;
			const v = visit;
			visit = null;
			const rect = v.dom.getBoundingClientRect();
			resolveAtomLeave(view, {
				nodeStart: v.nodeStart,
				nodeEnd: v.nodeEnd,
				entrySide: v.entrySide,
				savedAnchor: v.savedAnchor,
				included: v.included,
				clientX,
				clientY,
				rect
			});
		};

		const trackAtomUnderPointer = (view: EditorView, clientX: number, clientY: number) => {
			if (!dragging || !view.editable) return;

			let hit = hitAtomAtCoords(view, clientX, clientY);

			// When posAtCoords / DOM briefly misses: if pointer is still within the current visit rect, treat as still hitting
			// (otherwise it would leave → exclude, and PM would pull the selection outside the image on the next frame)
			if (!hit && visit && pointInRect(clientX, clientY, visit.dom.getBoundingClientRect())) {
				hit = {
					nodeStart: visit.nodeStart,
					nodeEnd: visit.nodeEnd,
					dom: visit.dom
				};
			}

			if (hit) {
				const rect = hit.dom.getBoundingClientRect();
				const pen = atomPenetrationDepth(clientX, clientY, rect);

				if (visit && visit.nodeStart !== hit.nodeStart) {
					leaveCurrentVisit(view, clientX, clientY);
				}

				if (!visit || visit.nodeStart !== hit.nodeStart) {
					const sel = view.state.selection;
					if (sel instanceof NodeSelection || sel.empty) return;

					const entrySide = entrySideFromSelection(sel, hit.nodeStart, hit.nodeEnd);
					if (!entrySide) {
						// Selection already covers this node: just keep it
						if (sel.from <= hit.nodeStart && sel.to >= hit.nodeEnd) {
							visit = {
								nodeStart: hit.nodeStart,
								nodeEnd: hit.nodeEnd,
								maxPenetration: pen,
								included: true,
								entrySide: sel.anchor <= hit.nodeStart ? 'above' : 'below',
								savedAnchor: sel.anchor,
								dom: hit.dom
							};
						}
						return;
					}

					visit = {
						nodeStart: hit.nodeStart,
						nodeEnd: hit.nodeEnd,
						maxPenetration: pen,
						included: false,
						entrySide,
						savedAnchor: sel.anchor,
						dom: hit.dom
					};
				} else {
					visit.maxPenetration = Math.max(visit.maxPenetration, pen);
				}

				// Once truly entered, merge immediately; re-merge each frame to counteract PM mouseDown.move rewriting
				const threshold = effectivePenetrationThreshold(rect);
				if (visit && visit.maxPenetration >= threshold) {
					includeAtomInDragSelection(view, visit.nodeStart, visit.nodeEnd);
					visit.included = true;
				}
				return;
			}

			// Pointer has left the atom
			if (visit) {
				leaveCurrentVisit(view, clientX, clientY);
			}
		};

		return [
			new Plugin({
				key: selectAcrossAtomsKey,
				props: {
					handleClick(view, _pos, event) {
						return selectAtomOnClick(view, event);
					},
					handleDOMEvents: {
						mousedown(view, event) {
							// Right-click within selection: preventDefault stops browser from collapsing ::selection;
							// return true prevents PM from collapsing atom to NodeSelection
							if (shouldPreserveSelectionOnRightClick(view, event)) {
								const sel = view.state.selection;
								preservedOnRightClick = { anchor: sel.anchor, head: sel.head };
								event.preventDefault();
								scheduleRestorePreserved(view);
								return true;
							}
							preservedOnRightClick = null;
							if (event.button === 0) {
								dragging = true;
								mouseDownX = event.clientX;
								mouseDownY = event.clientY;
								resetVisit();
							}
							return false;
						},
						mouseup(view, event) {
							if (event.button === 2 && preservedOnRightClick) {
								restorePreservedSelection(view, preservedOnRightClick);
								scheduleRestorePreserved(view);
								// Right-click flow ended; system context menu may not appear due to preventDefault
								preservedOnRightClick = null;
							}
							if (dragging && visit) {
								// Mouse released on atom: intent is ambiguous, keep the merged state
								// (don't do same-side exclusion since we never left)
								const threshold = effectivePenetrationThreshold(visit.dom.getBoundingClientRect());
								if (!visit.included && visit.maxPenetration >= threshold) {
									includeAtomInDragSelection(view, visit.nodeStart, visit.nodeEnd);
								}
							}
							// If PM skips handleClick due to minor movement (allowDefault=true), supplement with click-select here
							if (
								dragging &&
								event.button === 0 &&
								!visit &&
								Math.abs(event.clientX - mouseDownX) <= 4 &&
								Math.abs(event.clientY - mouseDownY) <= 4
							) {
								selectAtomOnClick(view, event);
							}
							dragging = false;
							resetVisit();
							return false;
						},
						contextmenu(view, event) {
							// Some browsers still fire contextmenu; restore the selection then allow the menu
							if (!preservedOnRightClick) return false;
							restorePreservedSelection(view, preservedOnRightClick);
							scheduleRestorePreserved(view);
							const snap = preservedOnRightClick;
							queueMicrotask(() => {
								if (preservedOnRightClick === snap) {
									restorePreservedSelection(view, snap);
									preservedOnRightClick = null;
								}
							});
							void event;
							return false;
						},
						mousemove(view, event) {
							if (!dragging || event.buttons !== 1 || !view.editable) return false;
							trackAtomUnderPointer(view, event.clientX, event.clientY);
							return false;
						}
					},
					decorations(state) {
						const sel = state.selection;
						if (sel.empty) return null;

						const decos: Decoration[] = [];

						if (sel instanceof NodeSelection) {
							if (isAcrossSelectableNode(sel.node)) {
								decos.push(
									Decoration.node(sel.from, sel.to, {
										class: 'ProseMirror-selectednode'
									})
								);
							}
						} else {
							state.doc.nodesBetween(sel.from, sel.to, (node, pos) => {
								if (!isAcrossSelectableNode(node)) return;
								if (sel.from <= pos && sel.to >= pos + node.nodeSize) {
									decos.push(
										Decoration.node(pos, pos + node.nodeSize, {
											class: 'ProseMirror-selectednode'
										})
									);
								}
							});
						}

						return decos.length ? DecorationSet.create(state.doc, decos) : null;
					}
				},
				view(editorView) {
					const onMove = (event: MouseEvent) => {
						if (!dragging || event.buttons !== 1 || !editorView.editable) return;
						// Re-merge after PM has processed mousemove (which may have pulled the selection outside the atom)
						trackAtomUnderPointer(editorView, event.clientX, event.clientY);
						requestAnimationFrame(() => {
							if (!dragging || event.buttons !== 1) return;
							trackAtomUnderPointer(editorView, event.clientX, event.clientY);
						});
					};
					const onUp = (event: MouseEvent) => {
						if (event.button === 2 && preservedOnRightClick) {
							restorePreservedSelection(editorView, preservedOnRightClick);
							scheduleRestorePreserved(editorView);
							preservedOnRightClick = null;
						}
						if (dragging && visit) {
							const threshold = effectivePenetrationThreshold(visit.dom.getBoundingClientRect());
							if (!visit.included && visit.maxPenetration >= threshold) {
								includeAtomInDragSelection(editorView, visit.nodeStart, visit.nodeEnd);
							}
						}
						if (
							dragging &&
							event.button === 0 &&
							!visit &&
							Math.abs(event.clientX - mouseDownX) <= 4 &&
							Math.abs(event.clientY - mouseDownY) <= 4
						) {
							selectAtomOnClick(editorView, event);
						}
						dragging = false;
						resetVisit();
					};
					window.addEventListener('mousemove', onMove);
					window.addEventListener('mouseup', onUp);
					return {
						destroy() {
							window.removeEventListener('mousemove', onMove);
							window.removeEventListener('mouseup', onUp);
							if (restoreRaf) cancelAnimationFrame(restoreRaf);
						}
					};
				}
			})
		];
	}
});
