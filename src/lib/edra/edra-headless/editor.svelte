<script lang="ts">
	import { type Editor, type Content } from '@tiptap/core';
	import { onDestroy, onMount } from 'svelte';

	import Toolbar from './toolbar.svelte';
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
	import BubbleMenu from './menus/bubble-menu.svelte';
	import { Transaction } from '@tiptap/pm/state';

	const lowlight = createLowlight(all);

	interface Props {
		class?: string;
		content?: Content;
		editable?: boolean;
		showToolBar?: boolean;
		showMenu?: boolean;
		editor?: Editor;
		/**
		 * Callback function to be called when the content is updated
		 * @param content
		 */
		onUpdate?: (props: { editor: Editor; transaction: Transaction }) => void;
	}

	let {
		class: className = '',
		content = $bindable(),
		editable = true,
		showToolBar = true,
		showMenu = true,
		editor = $bindable<Editor | undefined>(),
		onUpdate
	}: Props = $props();

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
				slashcommand(SlashCommandList)
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
	});

	onDestroy(() => {
		console.log('Destroying editor');
		editor?.destroy();
	});
</script>

<div class={`edra ${className}`}>
	{#if editor}
		{#if showToolBar}
			<Toolbar {editor} />
		{/if}
		{#if showMenu}
			<LinkMenu {editor} />
			<TableRowMenu {editor} />
			<TableColMenu {editor} />
			<BubbleMenu {editor} />
		{/if}
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
