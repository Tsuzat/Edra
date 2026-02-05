import Minus from '@lucide/svelte/icons/minus';
import Quote from '@lucide/svelte/icons/quote';
import SquareCode from '@lucide/svelte/icons/square-code';
import type { Editor } from '@tiptap/core';
import commands from '../../commands/toolbar-commands.js';
import type { EdraToolBarCommands } from '../../commands/types.js';
import strings from '../../strings.js';

export interface Group {
	name: string;
	title: string;
	actions: EdraToolBarCommands[];
}

export const GROUPS: Group[] = [
	{
		name: 'format',
		title: strings.command.formatGroup,
		actions: [
			...commands.headings,
			{
				icon: Quote,
				name: 'blockquote',
				tooltip: strings.command.blockQuote,
				onClick: (editor: Editor) => {
					editor.chain().focus().setBlockquote().run();
				}
			},
			{
				icon: SquareCode,
				name: 'codeBlock',
				tooltip: strings.command.codeBlock,
				onClick: (editor: Editor) => {
					editor.chain().focus().setCodeBlock().run();
				}
			},
			...commands.lists
		]
	},
	{
		name: 'insert',
		title: strings.command.insertGroup,
		actions: [
			...commands.media,
			...commands.table,
			...commands.math,
			{
				icon: Minus,
				name: 'horizontalRule',
				tooltip: strings.command.horizontalRule,
				onClick: (editor: Editor) => {
					editor.chain().focus().setHorizontalRule().run();
				}
			}
		]
	}
];

export default GROUPS;
