import type { Editor } from '@tiptap/core';
import { Node, Slice } from '@tiptap/pm/model';
import { Decoration, DecorationSet, EditorView } from '@tiptap/pm/view';

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

/**
 * Function to handle paste event of an image
 * @param editor Editor - editor instance
 * @param maxSize number - max size of the image to be pasted in MB, default is 2MB
 */
export function getHandlePaste(editor: Editor, maxSize: number = 2) {
	return (view: EditorView, event: ClipboardEvent, slice: Slice) => {
		const item = event.clipboardData?.items[0];

		if (item?.type.indexOf('image') !== 0) {
			return;
		}

		const file = item.getAsFile();
		if (file === null || file.size === undefined) return;
		let filesize = (file?.size / 1024 / 1024).toFixed(4);

		if (filesize && Number(filesize) > maxSize) {
			window.alert(`too large image! filesize: ${filesize} mb`);
			return;
		}

		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = (e) => {
			if (e.target?.result) {
				editor.commands.setImage({ src: e.target.result as string });
			}
		};
	};
}
