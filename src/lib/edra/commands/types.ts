import type { Editor } from '@tiptap/core';
import type { icons } from 'lucide-svelte';

export interface EdraCommand {
	iconName: keyof typeof icons;
	name: string;
	label: string;
	shortCuts?: string[];
	action: (editor: Editor) => void;
}

export interface EdraCommandShortCuts {
	key: string;
}

export interface EdraCommandGroup {
	name: string;
	label: string;
	commands: EdraCommand[];
}
