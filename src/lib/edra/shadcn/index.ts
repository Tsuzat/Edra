import { Tiptap } from '../tiptap/index.ts';
import Toolbar from './components/Toolbar.svelte';
import DragHandle from './drag-handle.svelte';
export { createEditor } from './editor.ts';
export * from '@tiptap/core';

const Edra = Object.assign(Tiptap, { Content: Tiptap.Content, Toolbar, DragHandle });
export { Edra };
