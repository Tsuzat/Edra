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
	import { AudioPlaceholder } from '../extensions/audio/AudioPlaceholder.js';
	import AudioPlaceholderComponent from './components/AudioPlaceholder.svelte';
	import AudioExtendedComponent from './components/AudioExtended.svelte';
	import { ImagePlaceholder } from '../extensions/image/ImagePlaceholder.js';
	import ImagePlaceholderComponent from './components/ImagePlaceholder.svelte';
	import { VideoPlaceholder } from '../extensions/video/VideoPlaceholder.js';
	import VideoPlaceholderComponent from './components/VideoPlaceholder.svelte';
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
	import { focusEditor, type EdraProps } from '../utils.js';
	import IFramePlaceholderComponent from './components/IFramePlaceholder.svelte';
	import { IFramePlaceholder } from '../extensions/iframe/IFramePlaceholder.js';
	import { IFrameExtended } from '../extensions/iframe/IFrameExtended.js';
	import IFrameExtendedComponent from './components/IFrameExtended.svelte';

	const lowlight = createLowlight(all);

	let {
		class: className = '',
		content = undefined,
		editable = true,
		limit = undefined,
		editor = $bindable<Editor | undefined>(),
		showSlashCommands = true,
		showLinkBubbleMenu = true,
		showTableBubbleMenu = true,
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
				AudioPlaceholder(AudioPlaceholderComponent),
				ImagePlaceholder(ImagePlaceholderComponent),
				IFramePlaceholder(IFramePlaceholderComponent),
				IFrameExtended(IFrameExtendedComponent),
				VideoPlaceholder(VideoPlaceholderComponent),
				AudioExtended(AudioExtendedComponent),
				ImageExtended(ImageExtendedComponent),
				VideoExtended(VideoExtendedComponent),
				...(showSlashCommands ? [slashcommand(SlashCommandList)] : [])
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

<div class={`edra ${className}`}>
	{@render children?.()}
	{#if editor}
		{#if showLinkBubbleMenu}
			<LinkMenu {editor} />
		{/if}
		{#if showTableBubbleMenu}
			<TableRowMenu {editor} />
			<TableColMenu {editor} />
		{/if}
	{/if}
	{#if !editor}
		<div class="edra-loading">
			<LoaderCircle class="animate-spin" /> Loading...
		</div>
	{/if}
	<div
		bind:this={element}
		role="button"
		tabindex="0"
		onclick={(event) => focusEditor(editor, event)}
		onkeydown={(event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				focusEditor(editor, event);
			}
		}}
		class="edra-editor"
	></div>
</div>

<style>
	:global(.ProseMirror) {
		min-height: 100%;
		position: relative;
		word-wrap: break-word;
		white-space: pre-wrap;
		cursor: auto;
		-webkit-font-variant-ligatures: none;
		font-variant-ligatures: none;
		&:focus {
			outline: none;
		}
	}
</style>
