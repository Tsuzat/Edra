import { SvelteNodeViewRenderer, useEditor } from '../tiptap/index.ts';
import { all, createLowlight } from 'lowlight';
import extensions from '../extensions.ts';
const lowlight = createLowlight(all);
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import CodeBlock from './components/CodeBlock.svelte';
import '../onedark.css';
import './editor.css';
import { MediaPlaceholder } from '../tiptap/extensions/MediaPlaceHolder.ts';
import MediaPlaceholderComp from './components/MediaPlaceHolder.svelte';

export const createEditor = () =>
	useEditor({
		extensions: [
			...extensions,
			CodeBlockLowlight.configure({
				lowlight
			}).extend({
				addNodeView() {
					return SvelteNodeViewRenderer(CodeBlock);
				}
			}),
			MediaPlaceholder(MediaPlaceholderComp)
		]
	});
