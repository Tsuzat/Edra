import { Tiptap } from '../tiptap/index.ts';
import Toolbar from './components/Toolbar.svelte';
import DragHandle from './drag-handle.svelte';
import Editor from './editor.svelte';
export { createEditor } from './editor.ts';
export * from '@tiptap/core';
import UseAI from './components/menu/AI.svelte';

const Edra = Object.assign(Tiptap, {
	Content: Editor,
	Toolbar,
	DragHandle,
	UseAI
});
export { Edra };
