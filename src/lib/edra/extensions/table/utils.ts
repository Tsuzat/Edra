import { type Editor, findParentNode } from '@tiptap/core';
import type { Node, ResolvedPos } from '@tiptap/pm/model';
import type { EditorState, Selection, Transaction } from '@tiptap/pm/state';
import { CellSelection, type Rect, TableMap } from '@tiptap/pm/tables';
import type { EditorView } from '@tiptap/pm/view';
import Table from './table.js';

export const isRectSelected = (rect: Rect) => (selection: CellSelection) => {
	const map = TableMap.get(selection.$anchorCell.node(-1));
	const start = selection.$anchorCell.start(-1);
	const cells = map.cellsInRect(rect);
	const selectedCells = map.cellsInRect(
		map.rectBetween(selection.$anchorCell.pos - start, selection.$headCell.pos - start)
	);

	for (let i = 0, count = cells.length; i < count; i += 1) {
		if (selectedCells.indexOf(cells[i]) === -1) {
			return false;
		}
	}

	return true;
};

export const findTable = (selection: Selection) =>
	findParentNode((node) => node.type.spec.tableRole && node.type.spec.tableRole === 'table')(
		selection
	);

export const isCellSelection = (selection: Selection): selection is CellSelection =>
	selection instanceof CellSelection;

export const isColumnSelected = (columnIndex: number) => (selection: Selection) => {
	if (isCellSelection(selection)) {
		const map = TableMap.get(selection.$anchorCell.node(-1));

		return isRectSelected({
			left: columnIndex,
			right: columnIndex + 1,
			top: 0,
			bottom: map.height
		})(selection);
	}

	return false;
};

export const isRowSelected = (rowIndex: number) => (selection: Selection) => {
	if (isCellSelection(selection)) {
		const map = TableMap.get(selection.$anchorCell.node(-1));

		return isRectSelected({
			left: 0,
			right: map.width,
			top: rowIndex,
			bottom: rowIndex + 1
		})(selection);
	}

	return false;
};

export const isTableSelected = (selection: Selection) => {
	if (isCellSelection(selection)) {
		const map = TableMap.get(selection.$anchorCell.node(-1));

		return isRectSelected({
			left: 0,
			right: map.width,
			top: 0,
			bottom: map.height
		})(selection);
	}

	return false;
};

export const getCellsInColumn = (columnIndex: number | number[]) => (selection: Selection) => {
	const table = findTable(selection);
	if (table) {
		const map = TableMap.get(table.node);
		const indexes = Array.isArray(columnIndex) ? columnIndex : Array.from([columnIndex]);

		return indexes.reduce(
			(acc, index) => {
				if (index >= 0 && index <= map.width - 1) {
					const cells = map.cellsInRect({
						left: index,
						right: index + 1,
						top: 0,
						bottom: map.height
					});

					return acc.concat(
						cells.map((nodePos) => {
							const node = table.node.nodeAt(nodePos);
							const pos = nodePos + table.start;

							return { pos, start: pos + 1, node };
						})
					);
				}

				return acc;
			},
			[] as { pos: number; start: number; node: Node | null | undefined }[]
		);
	}
	return null;
};

export const getCellsInRow = (rowIndex: number | number[]) => (selection: Selection) => {
	const table = findTable(selection);

	if (table) {
		const map = TableMap.get(table.node);
		const indexes = Array.isArray(rowIndex) ? rowIndex : Array.from([rowIndex]);

		return indexes.reduce(
			(acc, index) => {
				if (index >= 0 && index <= map.height - 1) {
					const cells = map.cellsInRect({
						left: 0,
						right: map.width,
						top: index,
						bottom: index + 1
					});

					return acc.concat(
						cells.map((nodePos) => {
							const node = table.node.nodeAt(nodePos);
							const pos = nodePos + table.start;
							return { pos, start: pos + 1, node };
						})
					);
				}

				return acc;
			},
			[] as { pos: number; start: number; node: Node | null | undefined }[]
		);
	}

	return null;
};

export const getCellsInTable = (selection: Selection) => {
	const table = findTable(selection);

	if (table) {
		const map = TableMap.get(table.node);
		const cells = map.cellsInRect({
			left: 0,
			right: map.width,
			top: 0,
			bottom: map.height
		});

		return cells.map((nodePos) => {
			const node = table.node.nodeAt(nodePos);
			const pos = nodePos + table.start;

			return { pos, start: pos + 1, node };
		});
	}

	return null;
};

export const findParentNodeClosestToPos = (
	$pos: ResolvedPos,
	predicate: (node: Node) => boolean
) => {
	for (let i = $pos.depth; i > 0; i -= 1) {
		const node = $pos.node(i);

		if (predicate(node)) {
			return {
				pos: i > 0 ? $pos.before(i) : 0,
				start: $pos.start(i),
				depth: i,
				node
			};
		}
	}

	return null;
};

export const findCellClosestToPos = ($pos: ResolvedPos) => {
	const predicate = (node: Node) =>
		node.type.spec.tableRole && /cell/i.test(node.type.spec.tableRole);

	return findParentNodeClosestToPos($pos, predicate);
};

const select = (type: 'row' | 'column') => (index: number) => (tr: Transaction) => {
	const table = findTable(tr.selection);
	const isRowSelection = type === 'row';

	if (table) {
		const map = TableMap.get(table.node);

		// Check if the index is valid
		if (index >= 0 && index < (isRowSelection ? map.height : map.width)) {
			const left = isRowSelection ? 0 : index;
			const top = isRowSelection ? index : 0;
			const right = isRowSelection ? map.width : index + 1;
			const bottom = isRowSelection ? index + 1 : map.height;

			const cellsInFirstRow = map.cellsInRect({
				left,
				top,
				right: isRowSelection ? right : left + 1,
				bottom: isRowSelection ? top + 1 : bottom
			});

			const cellsInLastRow =
				bottom - top === 1
					? cellsInFirstRow
					: map.cellsInRect({
							left: isRowSelection ? left : right - 1,
							top: isRowSelection ? bottom - 1 : top,
							right,
							bottom
						});

			const head = table.start + cellsInFirstRow[0];
			const anchor = table.start + cellsInLastRow[cellsInLastRow.length - 1];
			const $head = tr.doc.resolve(head);
			const $anchor = tr.doc.resolve(anchor);

			return tr.setSelection(new CellSelection($anchor, $head));
		}
	}
	return tr;
};

export const selectColumn = select('column');

export const selectRow = select('row');

export const selectTable = (tr: Transaction) => {
	const table = findTable(tr.selection);

	if (table) {
		const { map } = TableMap.get(table.node);

		if (map && map.length) {
			const head = table.start + map[0];
			const anchor = table.start + map[map.length - 1];
			const $head = tr.doc.resolve(head);
			const $anchor = tr.doc.resolve(anchor);

			return tr.setSelection(new CellSelection($anchor, $head));
		}
	}

	return tr;
};

export const isColumnGripSelected = ({
	editor,
	view,
	state,
	from
}: {
	editor: Editor;
	view: EditorView;
	state: EditorState;
	from: number;
}) => {
	const domAtPos = view.domAtPos(from).node as HTMLElement;
	const nodeDOM = view.nodeDOM(from) as HTMLElement;
	const node = nodeDOM || domAtPos;

	if (!editor.isActive(Table.name) || !node || isTableSelected(state.selection)) {
		return false;
	}

	let container = node;

	while (container && !['TD', 'TH'].includes(container.tagName)) {
		container = container.parentElement!;
	}

	const gripColumn =
		container && container.querySelector && container.querySelector('a.grip-column.selected');

	return !!gripColumn;
};

export const isRowGripSelected = ({
	editor,
	view,
	state,
	from
}: {
	editor: Editor;
	view: EditorView;
	state: EditorState;
	from: number;
}) => {
	const domAtPos = view.domAtPos(from).node as HTMLElement;
	const nodeDOM = view.nodeDOM(from) as HTMLElement;
	const node = nodeDOM || domAtPos;

	if (!editor.isActive(Table.name) || !node || isTableSelected(state.selection)) {
		return false;
	}

	let container = node;

	while (container && !['TD', 'TH'].includes(container.tagName)) {
		container = container.parentElement!;
	}

	const gripRow =
		container && container.querySelector && container.querySelector('a.grip-row.selected');

	return !!gripRow;
};

// Show row menu when a cell in that row is selected (DOM-based)
export const isRowActiveFromSelection = ({
	editor,
	view,
	state,
	from
}: {
	editor: Editor;
	view: EditorView;
	state: EditorState;
	from: number;
}) => {
	if (!editor.isActive(Table.name)) return false;

	// Container at the BubbleMenu anchor
	const domAtPos = view.domAtPos(from).node as HTMLElement;
	const nodeDOM = view.nodeDOM(from) as HTMLElement;
	let container = nodeDOM || domAtPos;

	while (container && !['TD', 'TH'].includes(container.tagName)) {
		container = container.parentElement!;
	}
	if (!container) return false;

	const rowEl = container.closest('tr');
	if (!rowEl) return false;

	// Current selection anchor cell
	const anchorDom = view.domAtPos(state.selection.$from.pos).node as HTMLElement;
	let anchorCell = anchorDom;
	while (anchorCell && !['TD', 'TH'].includes(anchorCell.tagName)) {
		anchorCell = anchorCell.parentElement!;
	}
	if (!anchorCell) return false;

	const anchorRow = anchorCell.closest('tr');
	return !!anchorRow && anchorRow === rowEl;
};

// Show column menu when a cell in that column is selected (DOM-based)
export const isColumnActiveFromSelection = ({
	editor,
	view,
	state,
	from
}: {
	editor: Editor;
	view: EditorView;
	state: EditorState;
	from: number;
}) => {
	if (!editor.isActive(Table.name)) return false;

	// Container at the BubbleMenu anchor (header cell)
	const domAtPos = view.domAtPos(from).node as HTMLElement;
	const nodeDOM = view.nodeDOM(from) as HTMLElement;
	let container = nodeDOM || domAtPos;

	while (container && !['TD', 'TH'].includes(container.tagName)) {
		container = container.parentElement!;
	}
	if (!container) return false;

	const headerRow = container.closest('tr');
	if (!headerRow) return false;

	const headerCells = Array.from(headerRow.children).filter(
		(el) => (el as HTMLElement).tagName === 'TD' || (el as HTMLElement).tagName === 'TH'
	);
	const containerIndex = headerCells.indexOf(container);
	if (containerIndex < 0) return false;

	// Current selection anchor cell DOM index in its row
	const anchorDom = view.domAtPos(state.selection.$from.pos).node as HTMLElement;
	let anchorCell = anchorDom;
	while (anchorCell && !['TD', 'TH'].includes(anchorCell.tagName)) {
		anchorCell = anchorCell.parentElement!;
	}
	if (!anchorCell) return false;

	const anchorRow = anchorCell.closest('tr');
	if (!anchorRow) return false;
	const anchorCells = Array.from(anchorRow.children).filter(
		(el) => (el as HTMLElement).tagName === 'TD' || (el as HTMLElement).tagName === 'TH'
	);
	const anchorIndex = anchorCells.indexOf(anchorCell);

	return anchorIndex === containerIndex;
};

const getCurrentCellRect = (tr: Transaction) => {
	const table = findTable(tr.selection);
	if (!table || !isCellSelection(tr.selection)) return null;
	const map = TableMap.get(table.node);
	const cell = map.findCell(tr.selection.$anchorCell.pos - table.start);
	return { table, map, cell };
};

type CellInfo = { pos: number; start: number; node: Node | null | undefined };

const getSpanMetrics = (n: Node | null | undefined) => {
	const attrs = (n?.attrs ?? {}) as Record<string, unknown>;
	const rowspan = typeof attrs.rowspan === 'number' ? attrs.rowspan : 1;
	const colspan = typeof attrs.colspan === 'number' ? attrs.colspan : 1;
	return { rowspan, colspan };
};

const hasSpans = (cellsA: CellInfo[] | null, cellsB: CellInfo[] | null) => {
	if (!cellsA || !cellsB) return true;
	if (cellsA.length !== cellsB.length) return true;
	// Disallow operation if any cell has rowspan/colspan > 1
	for (let i = 0; i < cellsA.length; i++) {
		const a = cellsA[i].node;
		const b = cellsB[i].node;
		const aSp = getSpanMetrics(a);
		const bSp = getSpanMetrics(b);
		if (aSp.rowspan !== 1 || aSp.colspan !== 1) return true;
		if (bSp.rowspan !== 1 || bSp.colspan !== 1) return true;
	}
	return false;
};

export const moveColumnLeft = (tr: Transaction) => {
	const ctx = getCurrentCellRect(tr);
	if (!ctx) return tr;
	const { cell } = ctx;
	const source = cell.left;
	const target = source - 1;
	if (target < 0) return tr;

	const sel = tr.selection as CellSelection;
	const sourceCells = getCellsInColumn(source)(sel);
	const targetCells = getCellsInColumn(target)(sel);
	if (hasSpans(sourceCells, targetCells)) return tr;

	for (let i = 0; i < sourceCells!.length; i++) {
		const a = sourceCells![i];
		const b = targetCells![i];
		const posA = tr.mapping.map(a.pos);
		const posB = tr.mapping.map(b.pos);
		const nodeA = tr.doc.nodeAt(posA);
		const nodeB = tr.doc.nodeAt(posB);
		if (!nodeA || !nodeB) continue;
		tr = tr.replaceWith(posA, posA + nodeA.nodeSize, (nodeB as Node).copy((nodeB as Node).content));
		const mappedB = tr.mapping.map(posB);
		const newNodeA = nodeA as Node;
		tr = tr.replaceWith(
			mappedB,
			mappedB + (nodeB as Node).nodeSize,
			newNodeA.copy(newNodeA.content)
		);
	}
	return tr;
};

export const moveColumnRight = (tr: Transaction) => {
	const ctx = getCurrentCellRect(tr);
	if (!ctx) return tr;
	const { map, cell } = ctx;
	const source = cell.left;
	const target = source + 1;
	if (target >= map.width) return tr;

	const sel = tr.selection as CellSelection;
	const sourceCells = getCellsInColumn(source)(sel);
	const targetCells = getCellsInColumn(target)(sel);
	if (hasSpans(sourceCells, targetCells)) return tr;

	for (let i = 0; i < sourceCells!.length; i++) {
		const a = sourceCells![i];
		const b = targetCells![i];
		const posA = tr.mapping.map(a.pos);
		const posB = tr.mapping.map(b.pos);
		const nodeA = tr.doc.nodeAt(posA);
		const nodeB = tr.doc.nodeAt(posB);
		if (!nodeA || !nodeB) continue;
		tr = tr.replaceWith(posA, posA + nodeA.nodeSize, (nodeB as Node).copy((nodeB as Node).content));
		const mappedB = tr.mapping.map(posB);
		const newNodeA = nodeA as Node;
		tr = tr.replaceWith(
			mappedB,
			mappedB + (nodeB as Node).nodeSize,
			newNodeA.copy(newNodeA.content)
		);
	}
	return tr;
};

export const moveRowUp = (tr: Transaction) => {
	const ctx = getCurrentCellRect(tr);
	if (!ctx) return tr;
	const { cell } = ctx;
	const source = cell.top;
	const target = source - 1;
	if (target < 0) return tr;
	const sel = tr.selection as CellSelection;
	const sourceRow = getCellsInRow(source)(sel);
	const targetRow = getCellsInRow(target)(sel);
	if (hasSpans(sourceRow, targetRow)) return tr;
	for (let i = 0; i < sourceRow!.length; i++) {
		const a = sourceRow![i];
		const b = targetRow![i];
		const posA = tr.mapping.map(a.pos);
		const posB = tr.mapping.map(b.pos);
		const nodeA = tr.doc.nodeAt(posA);
		const nodeB = tr.doc.nodeAt(posB);
		if (!nodeA || !nodeB) continue;
		tr = tr.replaceWith(posA, posA + nodeA.nodeSize, (nodeB as Node).copy((nodeB as Node).content));
		const mappedB = tr.mapping.map(posB);
		const newNodeA = nodeA as Node;
		tr = tr.replaceWith(
			mappedB,
			mappedB + (nodeB as Node).nodeSize,
			newNodeA.copy(newNodeA.content)
		);
	}
	return tr;
};

export const moveRowDown = (tr: Transaction) => {
	const ctx = getCurrentCellRect(tr);
	if (!ctx) return tr;
	const { map, cell } = ctx;
	const source = cell.top;
	const target = source + 1;
	if (target >= map.height) return tr;
	const sel = tr.selection as CellSelection;
	const sourceRow = getCellsInRow(source)(sel);
	const targetRow = getCellsInRow(target)(sel);
	if (hasSpans(sourceRow, targetRow)) return tr;
	for (let i = 0; i < sourceRow!.length; i++) {
		const a = sourceRow![i];
		const b = targetRow![i];
		const posA = tr.mapping.map(a.pos);
		const posB = tr.mapping.map(b.pos);
		const nodeA = tr.doc.nodeAt(posA);
		const nodeB = tr.doc.nodeAt(posB);
		if (!nodeA || !nodeB) continue;
		tr = tr.replaceWith(posA, posA + nodeA.nodeSize, (nodeB as Node).copy((nodeB as Node).content));
		const mappedB = tr.mapping.map(posB);
		const newNodeA = nodeA as Node;
		tr = tr.replaceWith(
			mappedB,
			mappedB + (nodeB as Node).nodeSize,
			newNodeA.copy(newNodeA.content)
		);
	}
	return tr;
};
