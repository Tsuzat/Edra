import type { Extensions } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { CharacterCount, Placeholder } from '@tiptap/extensions';
import strings from './strings.ts';
import Highlight from '@tiptap/extension-highlight';
import { Color, FontSize, TextStyle } from '@tiptap/extension-text-style';
import Typography from '@tiptap/extension-typography';
import Subscript from '@tiptap/extension-subscript';
import TextAlign from '@tiptap/extension-text-align';
import SuperScript from '@tiptap/extension-superscript';
import {
	Audio,
	ColorHighlighter,
	SelectAcrossAtoms,
	Table,
	TableCell,
	TableHeader,
	TableRow
} from './tiptap/index.ts';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { Markdown } from '@tiptap/markdown';
import Mathematics from '@tiptap/extension-mathematics';

/**
 * Contains all the default extensions the editor uses.
 */
export default [
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
			linkOnPaste: true,
			HTMLAttributes: {
				target: '_blank',
				rel: 'noopener noreferrer nofollow'
			}
		},
		codeBlock: false
	}),
	Audio,
	CharacterCount,
	Highlight.configure({
		multicolor: true
	}),
	Placeholder.configure({
		emptyEditorClass: 'is-empty',
		// Use a placeholder:
		// Use different placeholders depending on the node type:
		placeholder: ({ node }) => {
			if (node.type.name === 'heading') {
				return strings.editor.headingPlaceholder;
			}
			if (node.type.name === 'paragraph') {
				return strings.editor.paragraphPlaceholder;
			}
			return '';
		}
	}),
	Color,
	Subscript,
	SuperScript,
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
	// SearchAndReplace,
	Table,
	TableHeader,
	TableRow,
	TableCell,
	Markdown,
	Mathematics.configure({
		// Options for the KaTeX renderer. See here: https://katex.org/docs/options.html
		katexOptions: {
			throwOnError: true, // don't throw an error if the LaTeX code is invalid
			macros: {
				'\\R': '\\mathbb{R}', // add a macro for the real numbers
				'\\N': '\\mathbb{N}' // add a macro for the natural numbers
			}
		}
	}),
	// Drag-select across images/math/media; decorate selected atoms; keep selection on right-click
	SelectAcrossAtoms
] as Extensions;
