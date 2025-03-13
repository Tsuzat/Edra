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
import { SmilieReplacer } from './extensions/SmilieReplacer.js';
import { ColorHighlighter } from './extensions/ColorHighLighter.js';
import AutoJoiner from 'tiptap-extension-auto-joiner';
import GlobalDragHandle from 'tiptap-extension-global-drag-handle';
import { MathExtension } from '@aarkue/tiptap-math-extension';
import { Table, TableCell, TableHeader, TableRow } from './extensions/table/index.js';
import FontSize from './extensions/FontSize.js';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';

export const initiateEditor = (
	element?: HTMLElement,
	content?: Content,
	limit?: number,
	extensions?: Extensions,
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
				},
				codeBlock: false,
				text: false
			}),
			SmilieReplacer,
			ColorHighlighter,
			Superscript,
			Subscript,
			Underline,
			Link.configure({
				openOnClick: false,
				autolink: true,
				defaultProtocol: 'https',
				HTMLAttributes: {
					target: '_blank',
					rel: 'noopener noreferrer'
				}
			}),
			TaskList,
			TaskItem.configure({
				nested: true
			}),
			TextStyle,
			Color,
			Highlight.configure({ multicolor: true }),
			Text,
			Typography,
			TextAlign.configure({
				types: ['heading', 'paragraph']
			}),
			AutoJoiner,
			GlobalDragHandle.configure({
				excludedTags: ['pre', 'code']
			}),
			MathExtension.configure({ evaluation: true }),
			Table,
			TableHeader,
			TableRow,
			TableCell,
			FontSize,
			Placeholder.configure({
				emptyEditorClass: 'is-empty',
				// Use a placeholder:
				// Use different placeholders depending on the node type:
				placeholder: ({ node }) => {
					if (node.type.name === 'heading') {
						return 'What’s the title?';
					} else if (node.type.name === 'paragraph') {
						return 'Press / or write something ...';
					}
					return '';
				}
			}),
			CharacterCount.configure({
				limit
			}),

			...(extensions ?? [])
		],
		autofocus: true,
		...options
	});
};
