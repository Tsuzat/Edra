import { Extension } from '@tiptap/core';
import type { Node } from '@tiptap/pm/model';
import { Plugin } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

/**
 * Mirror the first textStyle fontSize inside each taskItem onto the <li>
 * as --edra-task-font-size, so the checkbox can scale with the line's text.
 */
const findTaskListFontSizes = (doc: Node) => {
	const decorations: Decoration[] = [];

	doc.descendants((node, pos) => {
		if (node.type.name !== 'taskItem') return;

		let fontSize: string | null = null;
		node.descendants((child) => {
			if (fontSize) return false;
			if (!child.isText) return;
			const mark = child.marks.find(
				(m) => m.type.name === 'textStyle' && typeof m.attrs.fontSize === 'string' && m.attrs.fontSize
			);
			if (mark?.attrs.fontSize) {
				fontSize = mark.attrs.fontSize as string;
				return false;
			}
		});

		if (!fontSize) return;

		decorations.push(
			Decoration.node(pos, pos + node.nodeSize, {
				style: `--edra-task-font-size: ${fontSize}`
			})
		);
	});

	return DecorationSet.create(doc, decorations);
};

/**
 * Keeps task-list checkbox size/alignment in sync with the line's textStyle fontSize.
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
