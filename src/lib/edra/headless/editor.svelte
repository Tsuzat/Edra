<script lang="ts">
	import { type Editor } from '@tiptap/core';
	import { onMount } from 'svelte';

	import { initiateEditor } from '../editor.js';
	import './style.css';
	import 'katex/dist/katex.min.css';

	// Lowlight
	import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
	import { all, createLowlight } from 'lowlight';
	import '../editor.css';
	import '../onedark.css';
	import { SvelteNodeViewRenderer } from 'svelte-tiptap';
	import CodeExtended from './components/CodeExtended.svelte';
	import { AudioPlaceHolder } from '../extensions/audio/AudioPlaceholder.js';
	import AudioPlaceHolderComponent from './components/AudioPlaceHolder.svelte';
	import AudioExtendedComponent from './components/AudioExtended.svelte';
	import { ImagePlaceHolder } from '../extensions/image/ImagePlaceHolder.js';
	import ImagePlaceHolderComponent from './components/ImagePlaceHolder.svelte';
	import { VideoPlaceHolder } from '../extensions/video/VideoPlaceHolder.js';
	import VideoPlaceHolderComponent from './components/VideoPlaceHolder.svelte';
	import { ImageExtended } from '../extensions/image/ImageExtended.js';
	import ImageExtendedComponent from './components/ImageExtended.svelte';
	import VideoExtendedComponent from './components/VideoExtended.svelte';
	import { VideoExtended } from '../extensions/video/VideoExtended.js';
	import { AudioExtended } from '../extensions/audio/AudiExtended.js';
	import LinkMenu from './menus/link-menu.svelte';
	import TableRowMenu from './menus/table/table-row-menu.svelte';
	import TableColMenu from './menus/table/table-col-menu.svelte';
	import slashcommand from '../extensions/slash-command/slashcommand.js';
	import SlashCommandList from './components/SlashCommandList.svelte';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import type { EdraProps } from '../utils.js';
	import DragHandle from '../drag-handle.svelte';
	import IFramePlaceholderComponent from './components/IFramePlaceholder.svelte';
	import { IFramePlaceHolder } from '../extensions/iframe/IFramePlaceHolder.js';
	import { IFrameExtended } from '../extensions/iframe/IFrameExtended.js';
	import IFrameExtendedComponent from './components/IFrameExtended.svelte';

	const lowlight = createLowlight(all);

	let {
		class: className = '',
		content = undefined,
		editable = true,
		showBubbleMenus = true,
		limit = undefined,
		editor = $bindable<Editor | undefined>(),
		showSlashCommand = true,
		onUpdate,
		children
	}: EdraProps = $props();

	let element = $state<HTMLElement>();

	onMount(() => {
		editor = initiateEditor(
			element,
			content,
			limit,
			[
				CodeBlockLowlight.configure({
					lowlight
				}).extend({
					addNodeView() {
						return SvelteNodeViewRenderer(CodeExtended);
					}
				}),
				AudioPlaceHolder(AudioPlaceHolderComponent),
				ImagePlaceHolder(ImagePlaceHolderComponent),
				IFramePlaceHolder(IFramePlaceholderComponent),
				IFrameExtended(IFrameExtendedComponent),
				VideoPlaceHolder(VideoPlaceHolderComponent),
				AudioExtended(AudioExtendedComponent),
				ImageExtended(ImageExtendedComponent),
				VideoExtended(VideoExtendedComponent),
				...(showSlashCommand ? [slashcommand(SlashCommandList)] : [])
			],
			{
				editable,
				onUpdate,
				onTransaction: (props) => {
					editor = undefined;
					editor = props.editor;
				}
			}
		);
		return () => editor?.destroy();
	});
</script>

{#if editor}
	<DragHandle {editor} />
{/if}

<div class={`edra ${className}`}>
	{@render children?.()}
	{#if editor && showBubbleMenus}
		<LinkMenu {editor} />
		<TableRowMenu {editor} />
		<TableColMenu {editor} />
	{/if}
	{#if !editor}
		<div class="edra-loading">
			<LoaderCircle class="animate-spin" /> Loading...
		</div>
	{/if}
	<div bind:this={element} class="edra-editor"></div>
</div>

<style>
	:global(.ProseMirror) {
		all: unset;
		&:focus {
			outline: none;
		}
	}
</style>
