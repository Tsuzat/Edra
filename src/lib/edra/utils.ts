import type { Editor } from '@tiptap/core';
import { Node } from '@tiptap/pm/model';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import type { EditorState } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';

export interface ShouldShowProps {
	editor: Editor;
	element: HTMLElement;
	view: EditorView;
	state: EditorState;
	oldState?: EditorState;
	from: number;
	to: number;
}

export const findColors = (doc: Node) => {
	const hexColor = /(#[0-9a-f]{3,6})\b/gi;
	const decorations: Decoration[] = [];

	doc.descendants((node, position) => {
		if (!node.text) {
			return;
		}

		Array.from(node.text.matchAll(hexColor)).forEach((match) => {
			const color = match[0];
			const index = match.index || 0;
			const from = position + index;
			const to = from + color.length;
			const decoration = Decoration.inline(from, to, {
				class: 'color',
				style: `--color: ${color}`
			});

			decorations.push(decoration);
		});
	});

	return DecorationSet.create(doc, decorations);
};

/**
 * Check if the current browser is mac or not
 */
export const isMac =
	navigator.userAgent.includes('Macintosh') || navigator.userAgent.includes('Mac OS X');

/**
 * Dupilcate content at the current selection
 * @param editor Editor instance
 * @param node Node to be duplicated
 */
export const duplicateContent = (editor: Editor, node: Node) => {
	const { view } = editor;
	const { state } = view;
	const { selection } = state;

	editor
		.chain()
		.insertContentAt(selection.to, node.toJSON(), {
			updateSelection: true
		})
		.focus(selection.to)
		.run();
};
