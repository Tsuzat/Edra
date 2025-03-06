<script lang="ts">
	import { type Editor, type Content, type Extensions } from '@tiptap/core';
	import { onDestroy, onMount } from 'svelte';

	import EdraToolbar from './edra-toolbar.svelte';
	import { initiateEditor } from '../editor.js';
	import './editor.css';
	import './style.css';
	import 'katex/dist/katex.min.css';

	// Lowlight
	import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
	import { all, createLowlight } from 'lowlight';
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

	const lowlight = createLowlight(all);

	interface Props {
		class?: string;
		content?: Content;
		editable?: boolean;
		extensions?: Extensions;
		/**
		 * Callback function to be called when the content is updated
		 * @param content
		 */
		onUpdate?: (content: Content) => void;
	}

	const {
		class: className = '',
		content = $bindable(),
		editable = true,
		extensions,
		onUpdate
	}: Props = $props();

	let editor = $state<Editor>();
	let element = $state<HTMLElement>();

	onMount(() => {
		editor = initiateEditor(
			element,
			content,
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
				VideoPlaceHolder(VideoPlaceHolderComponent),
				AudioExtended(AudioExtendedComponent),
				ImageExtended(ImageExtendedComponent),
				VideoExtended(VideoExtendedComponent),
				...(extensions ?? [])
			],
			{
				editable,
				onUpdate: (props) => {
					onUpdate?.(props.editor.getJSON());
				},
				onTransaction: (props) => {
					editor = undefined;
					editor = props.editor;
				}
			}
		);
	});

	onDestroy(() => {
		console.log('Destroying editor');
		editor?.destroy();
	});
</script>

<div class={`edra ${className}`}>
	{#if editor}
		<EdraToolbar {editor} />
		<LinkMenu {editor} />
		<TableRowMenu {editor} />
		<TableColMenu {editor} />
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
