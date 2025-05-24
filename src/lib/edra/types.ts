import type { Content, Editor } from '@tiptap/core';

export interface EdraEditorProps {
	content?: Content;
	editable?: boolean;
	editor?: Editor;
	onUpdate?: () => void;
	class?: string;
}

export interface EdraToolbarProps {
	editor: Editor;
	class?: string;
	excludedCommands?: string[];
}
