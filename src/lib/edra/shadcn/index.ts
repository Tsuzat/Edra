import { Tiptap } from '../tiptap/index.ts';
import Toolbar from './components/Toolbar.svelte';
export { createEditor } from './editor.ts';
export * from '@tiptap/core';

const Edra = Object.assign(Tiptap, { Content: Tiptap.Content, Toolbar });
export { Edra };
