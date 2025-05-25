import { Editor, type Extensions, type EditorOptions, type Content } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { getHandlePaste } from './utils.js';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Typography from '@tiptap/extension-typography';
import { ColorHighlighter } from './extensions/ColorHighlighter.js';
import { FontSize, TextStyle } from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import SearchAndReplace from './extensions/FindAndReplace.js';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { Table, TableCell, TableRow, TableHeader } from './extensions/table/index.js';

export default (
	element?: HTMLElement,
	content?: Content,
	extensions?: Extensions,
	options?: Partial<EditorOptions>
) => {
	const editor = new Editor({
		element,
		content,
		extensions: [
			StarterKit.configure({
				orderedList: {
					HTMLAttributes: {
						class: 'list-decimal'
					}
				},
				bulletList: {
					HTMLAttributes: {
						class: 'list-disc'
					}
				},
				heading: {
					levels: [1, 2, 3, 4]
				},
				link: {
					openOnClick: false,
					autolink: true,
					linkOnPaste: true
				},
				codeBlock: false
			}),
			Highlight.configure({
				multicolor: true
			}),
			Subscript,
			Superscript,
			Typography,
			ColorHighlighter,
			TextStyle,
			FontSize,
			TextAlign.configure({
				types: ['heading', 'paragraph']
			}),
			TaskList,
			TaskItem.configure({
				nested: true
			}),
			SearchAndReplace,
			Table,
			TableHeader,
			TableRow,
			TableCell,
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
