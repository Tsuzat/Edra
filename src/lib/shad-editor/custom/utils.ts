import type { Editor } from '@tiptap/core';
import { Node } from '@tiptap/pm/model';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export default function (doc: Node): DecorationSet {
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
}

export const duplicateContent = (editor: Editor) => {
	const { view } = editor;
	const { state } = view;
	const { selection } = state;

	editor
		.chain()
		.insertContentAt(selection.to, selection.content().content.firstChild?.toJSON(), {
			updateSelection: true
		})
		.focus(selection.to)
		.run();
};

/**
 * Function to download the content as a file
 * @param data string - data to be downloaded
 * @param fileName string - name of the file to be downloaded
 */
export const downloadFile = (data: string, fileName: string, type: string = 'text/plain') => {
	const blob = new Blob([data], { type });
	const url = window.URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = fileName;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	window.URL.revokeObjectURL(url);
};
