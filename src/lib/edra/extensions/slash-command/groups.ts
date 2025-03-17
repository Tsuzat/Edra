import { commands } from '../../commands/commands.js';

import type { EdraCommand } from '../../commands/types.js';
import type { Editor } from '@tiptap/core';

export interface Group {
	name: string;
	title: string;
	commands: EdraCommand[];
}

export const GROUPS: Group[] = [
	{
		name: 'format',
		title: 'Format',
		commands: [
			...commands.headings.commands,
			{
				iconName: 'Quote',
				name: 'blockquote',
				label: 'Blockquote',
				action: (editor: Editor) => {
					editor.chain().focus().setBlockquote().run();
				}
			},
			{
				iconName: 'SquareCode',
				name: 'codeBlock',
				label: 'Code Block',
				action: (editor: Editor) => {
					editor.chain().focus().setCodeBlock().run();
				}
			},
			...commands.lists.commands
		]
	},
	{
		name: 'insert',
		title: 'Insert',
		commands: [
			...commands.media.commands,
			...commands.table.commands,
			{
				iconName: 'Minus',
				name: 'horizontalRule',
				label: 'Horizontal Rule',
				action: (editor: Editor) => {
					editor.chain().focus().setHorizontalRule().run();
				}
			}
		]
	}
];

export default GROUPS;
