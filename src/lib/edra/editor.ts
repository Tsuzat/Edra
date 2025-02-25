import { Editor, type Content, type EditorOptions, type Extensions } from '@tiptap/core';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Text from '@tiptap/extension-text';

export const initiateEditor = (
	extensions: Extensions,
	element?: HTMLElement,
	content?: Content,
	options?: Partial<EditorOptions>
): Editor => {
	return new Editor({
		element: element,
		content: content,
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
					levels: [1, 2, 3, 4],
					HTMLAttributes: {
						class: 'tiptap-heading'
					}
				}
				// codeBlock: false,
				// text: false
			}),
			Superscript,
			Subscript,
			Underline,
			Link,
			TaskList,
			TaskItem,
			TextStyle,
			Color,
			Highlight,
			Text,
			Typography,
			TextAlign.configure({
				types: ['heading', 'paragraph']
			}),
			...extensions
		],
		autofocus: true,
		...options
	});
};
