import { commands } from '$lib/edra/commands/commands.js';
import type { EdraCommand } from '$lib/edra/commands/types.js';

export const turnIntoCommands: EdraCommand[] = [
	{
		iconName: 'Pilcrow',
		name: 'paragraph',
		label: 'Paragraph',
		action: (editor) => {
			editor.chain().focus().setParagraph().run();
		},
		isActive: (editor) => editor.isActive('paragraph')
	},
	...commands['headings'].commands,
	...commands['lists'].commands
];
