import type { Icon } from '@lucide/svelte';
import type { Editor } from '@tiptap/core';
import type { Node } from '@tiptap/pm/model';

export interface EdraToolBarCommands {
	name: string;
	icon: typeof Icon;
	tooltip?: string;
	shortCut?: string;
	onClick?: (editor: Editor) => void;
	turnInto?: (editor: Editor, node: Node, pos: number) => void;
	isActive?: (editor: Editor) => boolean;
	clickable?: (editor: Editor) => boolean;
}
