import { Extension } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';

import { findTaskListFontSizes } from '../../utils.ts';

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
