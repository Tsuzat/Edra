<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { EdraEditorProps } from '../types.js';
	import initEditor from '../editor.js';
	import '../editor.css';
	import './style.css';
	import '../onedark.css';
	import { ImagePlaceholder } from '../extensions/image/ImagePlaceholder.js';
	import ImagePlaceholderComp from './components/ImagePlaceholder.svelte';
	import { ImageExtended } from '../extensions/image/ImageExtended.js';
	import ImageExtendedComp from './components/ImageExtended.svelte';
	import { VideoPlaceholder } from '../extensions/video/VideoPlaceholder.js';
	import VideoPlaceHolderComp from './components/VideoPlaceholder.svelte';
	import { VideoExtended } from '../extensions/video/VideoExtended.js';
	import VideoExtendedComp from './components/VideoExtended.svelte';
	import { AudioPlaceholder } from '../extensions/audio/AudioPlaceholder.js';
	import { AudioExtended } from '../extensions/audio/AudiExtended.js';
	import AudioPlaceHolderComp from './components/AudioPlaceHolder.svelte';
	import AudioExtendedComp from './components/AudioExtended.svelte';
	import { IFramePlaceholder } from '../extensions/iframe/IFramePlaceholder.js';
	import { IFrameExtended } from '../extensions/iframe/IFrameExtended.js';
	import IFramePlaceHolderComp from './components/IFramePlaceHolder.svelte';
	import IFrameExtendedComp from './components/IFrameExtended.svelte';
	import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
	import { all, createLowlight } from 'lowlight';
	import { SvelteNodeViewRenderer } from 'svelte-tiptap';
	import CodeBlock from './components/CodeBlock.svelte';
	import TableCol from './menus/TableCol.svelte';
	import TableRow from './menus/TableRow.svelte';
	import Link from './menus/Link.svelte';
	import slashcommand from '../extensions/slash-command/slashcommand.js';
	import SlashCommandList from './components/SlashCommandList.svelte';
	import Mathematics from '@tiptap/extension-mathematics';
	import TableOfContents, {
		getHierarchicalIndexes,
		type TableOfContentData
	} from '@tiptap/extension-table-of-contents';
	import ToC from './components/ToC.svelte';
	import MathMenu from './menus/Math.svelte';
	import MathInline from './menus/MathInline.svelte';
	import { FileDrop } from '../extensions/HandleFileDrop.js';
	import { getHandleDropImage, getHandlePasteImage } from '../utils.js';

	const lowlight = createLowlight(all);

	let blockMathPos = $state(0);
	let blockMathLatex = $state('');

	let inlineMathPos = $state(0);
	let inlineMathLatex = $state('');

	let tocItems = $state<TableOfContentData>();

	/**
	 * Bind the element to the editor
	 */
	let element = $state<HTMLElement>();
	let {
		editor = $bindable(),
		editable = true,
		content,
		onUpdate,
		autofocus = false,
		class: className,
		onFileSelect,
		onDropOrPaste,
		getAssets
	}: EdraEditorProps = $props();

	onMount(() => {
		editor = initEditor(
			element,
			content,
			[
				CodeBlockLowlight.configure({
					lowlight
				}).extend({
					addNodeView() {
						return SvelteNodeViewRenderer(CodeBlock);
					}
				}),
				ImagePlaceholder(ImagePlaceholderComp),
				ImageExtended(ImageExtendedComp),
				VideoPlaceholder(VideoPlaceHolderComp),
				VideoExtended(VideoExtendedComp, onDropOrPaste),
				AudioPlaceholder(AudioPlaceHolderComp),
				AudioExtended(AudioExtendedComp, onDropOrPaste),
				IFramePlaceholder(IFramePlaceHolderComp),
				IFrameExtended(IFrameExtendedComp),
				slashcommand(SlashCommandList),
				FileDrop.configure({
					handler: onFileSelect,
					assetsGetter: getAssets
				}),
				Mathematics.configure({
					// Options for the block math node
					blockOptions: {
						onClick: (node, pos) => {
							blockMathPos = pos;
							blockMathLatex = node.attrs.latex;
						}
					},
					inlineOptions: {
						onClick: (node, pos) => {
							inlineMathPos = pos;
							inlineMathLatex = node.attrs.latex;
						}
					},
					// Options for the KaTeX renderer. See here: https://katex.org/docs/options.html
					katexOptions: {
						throwOnError: true, // don't throw an error if the LaTeX code is invalid
						macros: {
							'\R': '\mathbb{R}', // add a macro for the real numbers
							'\N': '\mathbb{N}' // add a macro for the natural numbers
						}
					}
				}),
				TableOfContents.configure({
					getIndex: getHierarchicalIndexes,
					onUpdate: (indexes) => {
						tocItems = indexes;
					},
					scrollParent: () => element || window
				})
			],
			{
				onUpdate,
				onTransaction(props) {
					editor = undefined;
					editor = props.editor;
				},
				editable,
				autofocus
			}
		);
		editor.setOptions({
			editorProps: {
				handlePaste: getHandlePasteImage(onDropOrPaste),
				handleDrop: getHandleDropImage(onDropOrPaste)
			}
		});
	});

	onDestroy(() => {
		if (editor) editor.destroy();
	});
</script>

{#if editor && !editor.isDestroyed}
	<Link {editor} />
	<TableCol {editor} />
	<TableRow {editor} />
	<MathMenu {editor} mathPos={blockMathPos} mathLatex={blockMathLatex} />
	<MathInline {editor} mathPos={inlineMathPos} mathLatex={inlineMathLatex} />
	<ToC {editor} items={tocItems} />
{/if}
<div bind:this={element} role="button" tabindex="0" class={`edra-editor ${className}`}></div>
