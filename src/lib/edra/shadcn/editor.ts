import {
	AIHighlight,
	IFrameExtended,
	ImageExtended,
	Mermaid,
	SlashCommand,
	SvelteNodeViewRenderer,
	useEditor,
	VideoExtended
} from '../tiptap/index.ts';
import { all, createLowlight } from 'lowlight';
import extensions from '../extensions.ts';
const lowlight = createLowlight(all);
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import CodeBlock from './components/CodeBlock.svelte';
import { MediaPlaceholder } from '../tiptap/extensions/MediaPlaceHolder.ts';
import MediaPlaceholderComp from './components/MediaPlaceHolder.svelte';
import ImageExtendedComp from './components/ImageExtended.svelte';
import VideoExtendedComp from './components/VideoExtended.svelte';
import IFrameComp from './components/IFrame.svelte';
import MermaidComp from './components/Mermaid.svelte';
import SlashCommandComp from './components/SlashCommand.svelte';

export interface EdraEditorProps {
	onUpdate?: () => void;
	onFileUpload?: (file: File) => Promise<string>;
}

export const createEditor = (props?: EdraEditorProps) =>
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
			MediaPlaceholder(MediaPlaceholderComp).configure({
				onUpload: props?.onFileUpload
			}),
			ImageExtended(ImageExtendedComp),
			VideoExtended(VideoExtendedComp),
			IFrameExtended(IFrameComp),
			Mermaid(MermaidComp),
			SlashCommand(SlashCommandComp),
			AIHighlight
		],
		onUpdate: props?.onUpdate || (() => {})
	});
