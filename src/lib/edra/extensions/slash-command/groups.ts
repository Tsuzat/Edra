import Minus from '@lucide/svelte/icons/minus';
import Quote from '@lucide/svelte/icons/quote';
import SquareCode from '@lucide/svelte/icons/square-code';
import type { Editor } from '@tiptap/core';
import toolbarCommands from '../../commands/toolbar-commands.js';
import type { EdraToolBarCommands } from '../../commands/types.js';
import strings from '../../strings.js';

export interface Group {
	name: string;
	title: string;
	commands: EdraToolBarCommands[];
}

export const GROUPS: Group[] = [
	{
		name: 'format',
		title: strings.command.formatGroup,
		commands: [
			...toolbarCommands.headings,
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
			...toolbarCommands.lists
		]
	},
	{
		name: 'insert',
		title: strings.command.insertGroup,
		commands: [
			...toolbarCommands.media,
			...toolbarCommands.table,
			...toolbarCommands.math,
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
