import { Tiptap } from '../tiptap/index.ts';
import Toolbar from './components/Toolbar.svelte';
import DragHandle from './drag-handle.svelte';
import Editor from './editor.svelte';
export { createEditor, type EdraEditorProps, type MathClickHandler } from './editor.ts';
export * from '@tiptap/core';
import UseAI from './components/menu/AI.svelte';
import BubbleMenu from './components/menu/BubbleMenu.svelte';

const Edra = Object.assign(Tiptap, {
	Content: Editor,
	Toolbar,
	BubbleMenu,
	DragHandle,
	UseAI
});
export { Edra };
