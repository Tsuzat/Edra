import type { Content, Editor, Extension } from '@tiptap/core';

export interface EdraEditorProps {
	extensions?: Extension[];
	content?: Content;
	editable?: boolean;
	editor?: Editor;
	onUpdate?: (content: Content) => void;
	class?: string;
}
