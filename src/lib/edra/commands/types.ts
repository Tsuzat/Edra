import type { Editor } from '@tiptap/core';
import { icons } from '@lucide/svelte';

export interface EdraToolBarCommands {
	name: string;
	icon: keyof typeof icons;
	tooltip?: string;
	shortCut?: string;
	onClick?: (editor: Editor) => void;
	isActive?: (editor: Editor) => boolean;
	clickable?: (editor: Editor) => boolean;
}
