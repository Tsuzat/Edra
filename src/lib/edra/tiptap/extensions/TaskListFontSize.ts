import { Extension } from '@tiptap/core';
import type { Node } from '@tiptap/pm/model';
import { Plugin } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

/** Rough px for comparing textStyle fontSize values (rem/em assume 16px root). */
const fontSizeToPx = (value: string): number | null => {
	const match = value.trim().match(/^([\d.]+)\s*(rem|em|px|pt)?$/i);
	if (!match) return null;
	const n = Number.parseFloat(match[1]);
	if (Number.isNaN(n)) return null;
	const unit = (match[2] || 'px').toLowerCase();
	switch (unit) {
		case 'rem':
		case 'em':
			return n * 16;
		case 'pt':
			return n * (96 / 72);
		default:
			return n;
	}
};

/**
 * Mirror the largest textStyle fontSize inside each taskItem onto the <li>
 * as --edra-task-font-size, so the checkbox (and checked strikethrough) scale
 * with the line even when inline text mixes multiple font sizes.
 *
 * When checked, also pin unmarked text runs to the editor default size so that
 * setting font-size on <p> for strikethrough metrics does not enlarge them.
 */
const findTaskListFontSizes = (doc: Node) => {
	const decorations: Decoration[] = [];

	doc.descendants((node, pos) => {
		if (node.type.name !== 'taskItem') return;

		let largest: string | null = null;
		let largestPx = -1;
		let hasExplicit = false;
		const isChecked = node.attrs.checked === true;
		const unmarkedRanges: { from: number; to: number }[] = [];

		node.descendants((child, offset) => {
			// Nested task lists have their own items; don't borrow their sizes.
			if (child.type.name === 'taskList' || child.type.name === 'taskItem') return false;
			if (!child.isText || !child.text) return;

			const mark = child.marks.find(
				(m) => m.type.name === 'textStyle' && typeof m.attrs.fontSize === 'string' && m.attrs.fontSize
			);
			const sizeStr = mark?.attrs.fontSize as string | undefined;
			const from = pos + 1 + offset;

			if (sizeStr) {
				hasExplicit = true;
				const px = fontSizeToPx(sizeStr);
				if (px != null && px > largestPx) {
					largestPx = px;
					largest = sizeStr;
				}
				return;
			}

			// Unmarked text uses the editor default (~1rem).
			const defaultPx = 16;
			if (defaultPx > largestPx) {
				largestPx = defaultPx;
				largest = '1rem';
			}
			unmarkedRanges.push({ from, to: from + child.nodeSize });
		});

		if (!hasExplicit || !largest) return;

		decorations.push(
			Decoration.node(pos, pos + node.nodeSize, {
				style: `--edra-task-font-size: ${largest}`
			})
		);

		if (isChecked) {
			for (const { from, to } of unmarkedRanges) {
				decorations.push(
					Decoration.inline(from, to, {
						class: 'edra-task-base-font'
					})
				);
			}
		}
	});

	return DecorationSet.create(doc, decorations);
};

/**
 * Keeps task-list checkbox size/alignment (and checked strikethrough metrics)
 * in sync with the largest textStyle fontSize.
 */
export const TaskListFontSize = Extension.create({
	name: 'taskListFontSize',

	addProseMirrorPlugins() {
		return [
			new Plugin({
				state: {
					init(_, { doc }) {
						return findTaskListFontSizes(doc);
					},
					apply(transaction, oldState) {
						return transaction.docChanged ? findTaskListFontSizes(transaction.doc) : oldState;
					}
				},
				props: {
					decorations(state) {
						return this.getState(state);
					}
				}
			})
		];
	}
});

export default TaskListFontSize;
