<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { onDestroy, onMount } from 'svelte';
	import initEditor from '../editor.js';
	import type { EdraEditorProps } from '../types.js';
	import '../editor.css';
	import './style.css';
	import '../onedark.css';
	import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
	import Mathematics from '@tiptap/extension-mathematics';
	import TableOfContents, { getHierarchicalIndexes } from '@tiptap/extension-table-of-contents';
	import { all, createLowlight } from 'lowlight';
	import { toast } from 'svelte-sonner';
	import { SvelteNodeViewRenderer } from 'svelte-tiptap';
	import { AudioExtended } from '../extensions/audio/AudiExtended.js';
	import { AudioPlaceholder } from '../extensions/audio/AudioPlaceholder.js';
	import { FileDrop } from '../extensions/HandleFileDrop.js';
	import { IFrameExtended } from '../extensions/iframe/IFrameExtended.js';
	import { IFramePlaceholder } from '../extensions/iframe/IFramePlaceholder.js';
	import { ImageExtended } from '../extensions/image/ImageExtended.js';
	import { ImagePlaceholder } from '../extensions/image/ImagePlaceholder.js';
	import slashcommand from '../extensions/slash-command/slashcommand.js';
	import { VideoExtended } from '../extensions/video/VideoExtended.js';
	import { VideoPlaceholder } from '../extensions/video/VideoPlaceholder.js';
	import { getHandleDropImage, getHandlePasteImage } from '../utils.js';
	import AudioExtendedComp from './components/AudioExtended.svelte';
	import AudioPlaceHolderComp from './components/AudioPlaceHolder.svelte';
	import CodeBlock from './components/CodeBlock.svelte';
	import IFrameExtendedComp from './components/IFrameExtended.svelte';
	import IFramePlaceHolderComp from './components/IFramePlaceHolder.svelte';
	import ImageExtendedComp from './components/ImageExtended.svelte';
	import ImagePlaceholderComp from './components/ImagePlaceholder.svelte';
	import SlashCommandList from './components/SlashCommandList.svelte';
	import VideoExtendedComp from './components/VideoExtended.svelte';
	import VideoPlaceHolderComp from './components/VideoPlaceholder.svelte';
	import Link from './menus/Link.svelte';
	import Math from './menus/Math.svelte';
	import MathInline from './menus/MathInline.svelte';
	import TableCol from './menus/TableCol.svelte';
	import TableRow from './menus/TableRow.svelte';

	const lowlight = createLowlight(all);

	let blockMathPos = $state(0);
	let blockMathLatex = $state('');

	let inlineMathPos = $state(0);
	let inlineMathLatex = $state('');

	let {
		editor = $bindable(),
		editable = true,
		content,
		element = $bindable<HTMLElement>(),
		onUpdate,
		autofocus = false,
		class: className,
		spellcheck = true,
		onFileSelect,
		onDropOrPaste
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
					handler: onFileSelect
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
							'\\R': '\\mathbb{R}', // add a macro for the real numbers
							'\\N': '\\mathbb{N}' // add a macro for the natural numbers
						}
					}
				}),
				TableOfContents.configure({
					getIndex: getHierarchicalIndexes,
					scrollParent: () => element || window
				})
			],
			{
				onUpdate,
				onTransaction(props) {
					editor = undefined;
					editor = props.editor;
				},
				onContentError: (error) => {
					toast.error('Unable to load the content', {
						description: 'The content of this page might be corrupted.'
					});
					console.error(error);
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
	<Link {editor} parentElement={element} />
	<TableCol {editor} parentElement={element} />
	<TableRow {editor} parentElement={element} />
	<Math {editor} mathPos={blockMathPos} mathLatex={blockMathLatex} parentElement={element} />
	<MathInline
		{editor}
		mathPos={inlineMathPos}
		mathLatex={inlineMathLatex}
		parentElement={element}
	/>
{/if}

<div
	bind:this={element}
	id="edra-editor"
	class={cn('edra-editor h-full w-full cursor-auto *:outline-none', className)}
	{spellcheck}
></div>
