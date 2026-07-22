import {
	AIHighlight,
	Callout,
	IFrameExtended,
	ImageExtended,
	Mermaid,
	SlashCommand,
	SvelteNodeViewRenderer,
	useEditor,
	VideoExtended,
	type Editor
} from '../tiptap/index.ts';
import { all, createLowlight } from 'lowlight';
import extensions, { katexOptions } from '../extensions.ts';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import CodeBlock from './components/CodeBlock.svelte';
import { MediaPlaceholder } from '../tiptap/extensions/MediaPlaceHolder.ts';
import MediaPlaceholderComp from './components/MediaPlaceHolder.svelte';
import ImageExtendedComp from './components/ImageExtended.svelte';
import VideoExtendedComp from './components/VideoExtended.svelte';
import IFrameComp from './components/IFrame.svelte';
import MermaidComp from './components/Mermaid.svelte';
import SlashCommandComp from './components/SlashCommand.svelte';
import CalloutComp from './components/Callout.svelte';
import TableOfContents, { getHierarchicalIndexes } from '@tiptap/extension-table-of-contents';
import { setTocItems } from './toc.svelte';
import Mathematics from '@tiptap/extension-mathematics';
import type { Node } from '@tiptap/pm/model';

const lowlight = createLowlight(all);

export type MathClickHandler = (
	node: Node,
	pos: number,
	isBlock: boolean,
	editor: Editor
) => void;

export interface EdraEditorProps {
	onUpdate?: () => void;
	/**
	 * Callback function to handle file uploads when a user drags/drops, pastes,
	 * or selects a media file (image, video, audio) to insert.
	 * It should upload the file to your storage (e.g., S3, Vercel Blob, etc.)
	 * and return a promise resolving to the public URL of the uploaded file.
	 *
	 * @param file The file to be uploaded.
	 * @returns A promise resolving to the uploaded file's URL.
	 */
	onFileUpload?: (file: File) => Promise<string>;
	callAI?: (
		prompt: string,
		onChunk: (chunk: string) => void,
		onError: (error: Error) => void
	) => Promise<void>;
	/**
	 * Called when the user clicks a math node. Forwards TipTap Mathematics `onClick`
	 * for both block and inline math, and includes `isBlock` plus the editor instance.
	 */
	onMathClick?: MathClickHandler;
}

export const createEditor = (props?: EdraEditorProps) => {
	let editorRef: Editor | undefined;
	const onMathClick = props?.onMathClick;

	const editor = useEditor({
		extensions: [
			...extensions,
			Mathematics.configure({
				katexOptions,
				blockOptions: onMathClick
					? {
							onClick: (node, pos) => {
								if (editorRef) onMathClick(node, pos, true, editorRef);
							}
						}
					: undefined,
				inlineOptions: onMathClick
					? {
							onClick: (node, pos) => {
								if (editorRef) onMathClick(node, pos, false, editorRef);
							}
						}
					: undefined
			}),
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
			Callout(CalloutComp),
			AIHighlight.configure({
				callAI: props?.callAI || null
			}),
			TableOfContents.configure({
				getIndex: getHierarchicalIndexes,
				onUpdate: (indexes) => {
					setTocItems(indexes);
				}
			})
		],
		onUpdate: props?.onUpdate || (() => {})
	});

	editorRef = editor;
	return editor;
};
