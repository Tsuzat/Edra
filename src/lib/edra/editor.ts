import { Editor, Extension, type EditorOptions } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { getHandlePaste } from './utils.js';

export default (
	element?: HTMLElement,
	extensions?: Extension[],
	options?: Partial<EditorOptions>
) => {
	const editor = new Editor({
		element,
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [1, 2, 3]
				}
			}),
			...(extensions ?? [])
		],
		injectCSS: false,
		...options
	});

	editor.setOptions({
		editorProps: {
			handlePaste: getHandlePaste(editor)
		}
	});
	return editor;
};
