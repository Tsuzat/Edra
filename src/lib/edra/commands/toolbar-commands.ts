import type { EdraToolBarCommands } from './types.js';
import { isMac } from '../utils.js';

const commands: Record<string, EdraToolBarCommands[]> = {
	'undo-redo': [
		{
			icon: 'Undo',
			name: 'undo',
			tooltip: 'Undo',
			shortCut: `${isMac ? '⌘' : 'Ctrl'}+Z`,
			onClick: (editor) => {
				editor.chain().focus().undo().run();
			},
			clickable: (editor) => {
				return editor.can().undo();
			}
		},
		{
			icon: 'Redo',
			name: 'redo',
			tooltip: 'Redo',
			shortCut: `${isMac ? '⌘' : 'Ctrl'}+Y`,
			onClick: (editor) => {
				editor.chain().focus().redo().run();
			},
			clickable: (editor) => {
				return editor.can().redo();
			}
		}
	],
	heading: [
		{
			icon: 'H1',
			name: 'h1',
			tooltip: 'Heading 1',
			onClick: (editor) => {
				editor.chain().focus().toggleHeading({ level: 1 }).run();
			},
			clickable: (editor) => {
				return editor.can().toggleHeading({ level: 1 });
			}
		},
		{
			icon: 'H2',
			name: 'h2',
			tooltip: 'Heading 2',
			onClick: (editor) => {
				editor.chain().focus().toggleHeading({ level: 2 }).run();
			},
			clickable: (editor) => {
				return editor.can().toggleHeading({ level: 2 });
			}
		},
		{
			icon: 'H3',
			name: 'h3',
			tooltip: 'Heading 3',
			onClick: (editor) => {
				editor.chain().focus().toggleHeading({ level: 3 }).run();
			},
			clickable: (editor) => {
				return editor.can().toggleHeading({ level: 3 });
			}
		},
		{
			icon: 'H4',
			name: 'h4',
			tooltip: 'Heading 4',
			onClick: (editor) => {
				editor.chain().focus().toggleHeading({ level: 4 }).run();
			},
			clickable: (editor) => {
				return editor.can().toggleHeading({ level: 4 });
			}
		}
	]
};

export default commands;
