import { Extension } from '@tiptap/core';
import { NodeSelection, Plugin, PluginKey, Selection, TextSelection } from '@tiptap/pm/state';
import { Decoration, DecorationSet, type EditorView } from '@tiptap/pm/view';
import type { Node as ProseMirrorNode, ResolvedPos } from '@tiptap/pm/model';

const selectAcrossAtomsKey = new PluginKey('selectAcrossAtoms');

/** 边缘掠过穿透深度低于此值视为「轻微误入」，不并入选区 */
export const ATOM_SLIGHT_PENETRATION_PX = 12;

export type AtomVerticalSide = 'above' | 'below';

/** 块级叶子 / atom：拖选时需整块并入 TextSelection */
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
 * 构造覆盖 [nodeStart, nodeEnd) 且保留原 anchor 的 TextSelection。
 * 不能直接 TextSelection.between(anchor, nodeEnd)：nodeEnd 常在 doc 间隙，
 * between 会把 head 收回图片/公式之前，导致节点未真正并入选区。
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

/** 鼠标相对元素的穿透深度（距最近边的距离）；在元素外为 0 */
export function atomPenetrationDepth(
	clientX: number,
	clientY: number,
	rect: DOMRectReadOnly
): number {
	if (
		clientX < rect.left ||
		clientX > rect.right ||
		clientY < rect.top ||
		clientY > rect.bottom
	) {
		return 0;
	}
	return Math.min(
		clientX - rect.left,
		rect.right - clientX,
		clientY - rect.top,
		rect.bottom - clientY
	);
}

/** 根据选区相对原子节点的位置，判断拖选是从上方还是下方进入 */
export function entrySideFromSelection(
	sel: Selection,
	nodeStart: number,
	nodeEnd: number
): AtomVerticalSide | null {
	const from = Math.min(sel.anchor, sel.head);
	const to = Math.max(sel.anchor, sel.head);
	if (to <= nodeStart) return 'above';
	if (from >= nodeEnd) return 'below';
	// 已跨越：以 anchor 所在侧为准
	if (sel.anchor <= nodeStart) return 'above';
	if (sel.anchor >= nodeEnd) return 'below';
	return null;
}

/** 离开时根据指针相对节点矩形的位置判断出口侧 */
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

/** 将原子节点并入当前拖选 TextSelection（保留 anchor） */
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
 * 从选区中排除原子节点，把选区收回到指定侧（误入后原路离开）。
 * savedAnchor：进入前的 anchor，用于尽量恢复进入前的选区意图。
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
 * 离开原子节点时结算：同侧离开 → 排除图片；对侧离开 → 保留并入。
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
		// 穿到对侧：选区应包含图片
		includeAtomInDragSelection(view, opts.nodeStart, opts.nodeEnd);
	}
}

/**
 * 仅当坐标落在原子节点「内部」时命中。
 * 不用 nodeBefore：段落开头紧贴上方图片时会被误判。
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
 * 优先用 elementFromPoint 命中 NodeView（拖选时 posAtCoords 常落在图片前后间隙）。
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
				/* posAtDOM 失败则回退 */
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
		clientX >= rect.left &&
		clientX <= rect.right &&
		clientY >= rect.top &&
		clientY <= rect.bottom
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

/** 右键是否落在当前非空选区内（含被 TextSelection 完整覆盖的 atom） */
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
 * 左键点选原子节点：NodeView 上 posAtCoords.inside 常为 -1，
 * PM 默认 selectClickedLeaf 会失败，需用 DOM 命中补 NodeSelection。
 */
function selectAtomOnClick(view: EditorView, event: MouseEvent): boolean {
	if (event.button !== 0 || !view.editable) return false;

	const target = event.target;
	if (
		target instanceof Element &&
		target.closest(
			'.resize-handle, .media-toolbar, .more-options-menu, input, button, textarea, a'
		)
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
 * 拖选经过图片 / 公式等原子节点时，把整块并入 TextSelection。
 *
 * - 左键点击图片等 atom → NodeSelection + 选中高亮
 * - 真正进入（穿透够深）→ 立刻并入选区
 * - 离开时：回到进入侧 → 排除图片；穿到对侧 → 保留包含图片
 * - 边缘轻微掠过 → 不并入
 * - 选区内右键：preventDefault + 恢复快照，保持 TextSelection / atom 高亮
 */
export const SelectAcrossAtoms = Extension.create({
	name: 'selectAcrossAtoms',

	addProseMirrorPlugins() {
		let dragging = false;
		let visit: AtomVisit | null = null;
		/** 选区内右键时暂存选区，避免浏览器/PM 收成光标或 NodeSelection */
		let preservedOnRightClick: PreservedRange | null = null;
		let restoreRaf = 0;
		/** 左键按下时指针位置，用于区分「点选」与「拖选」 */
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

			// posAtCoords / DOM 短暂 miss 时：若指针仍在当前 visit 矩形内，继续当作命中
			// （否则会 leave → 排除，而 PM 下一帧又会把选区收到图片外）
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
						// 选区已覆盖该节点：保持即可
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

				// 真正进入后立刻并入；之后每帧再并一次，抵消 PM mouseDown.move 的回写
				if (visit && visit.maxPenetration >= ATOM_SLIGHT_PENETRATION_PX) {
					includeAtomInDragSelection(view, visit.nodeStart, visit.nodeEnd);
					visit.included = true;
				}
				return;
			}

			// 指针已离开原子
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
							// 选区内右键：preventDefault 阻止浏览器收起 ::selection；
							// return true 阻止 PM 把 atom 收成 NodeSelection
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
								// 右键流程结束；系统菜单可能因 preventDefault 不弹出
								preservedOnRightClick = null;
							}
							if (dragging && visit) {
								// 在原子上松手：视为停在进入侧意图不明显，保留已并入状态
								// （未离开则不做同侧排除）
								if (!visit.included && visit.maxPenetration >= ATOM_SLIGHT_PENETRATION_PX) {
									includeAtomInDragSelection(view, visit.nodeStart, visit.nodeEnd);
								}
							}
							// PM 若因微移将 allowDefault=true 跳过 handleClick，这里补点选
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
							// 部分浏览器仍会触发 contextmenu；恢复选区后允许菜单
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
						// 在 PM 处理完 mousemove（可能把选区收到 atom 外）之后再并入
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
							if (!visit.included && visit.maxPenetration >= ATOM_SLIGHT_PENETRATION_PX) {
								includeAtomInDragSelection(
									editorView,
									visit.nodeStart,
									visit.nodeEnd
								);
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
