import { Tiptap } from '../tiptap/index.ts';
export { createEditor } from './editor.ts';
export * from '@tiptap/core';

const Edra = Object.assign(Tiptap, { Content: Tiptap.Content });
export { Edra };
