<script lang="ts">
	import type { Content, Editor } from '@tiptap/core';
	import { onMount } from 'svelte';
	import { initiateEditor } from '../editor.js';
	import { Transaction } from '@tiptap/pm/state';
	import Toolbar from './toolbar.svelte';

	import '../editor.css';
	import './style.css';
	import '../onedark.css';

	import 'katex/dist/katex.min.css';
	import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
	import CodeExtended from './components/CodeExtended.svelte';
	import { all, createLowlight } from 'lowlight';
	import { SvelteNodeViewRenderer } from 'svelte-tiptap';
	import { ImagePlaceHolder } from '../extensions/image/ImagePlaceHolder.js';
	import ImagePlaceHolderComponent from './components/ImagePlaceHolder.svelte';
	import { AudioPlaceHolder } from '../extensions/audio/AudioPlaceholder.js';
	import AudioPlaceHolderComponent from './components/AudioPlaceHolder.svelte';
	import { VideoPlaceHolder } from '../extensions/video/VideoPlaceHolder.js';
	import VideoPlaceHolderComponent from './components/VideoPlaceHolder.svelte';
	const lowlight = createLowlight(all);

	interface Props {
		class?: string;
		content?: Content;
		editable?: boolean;
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
				VideoPlaceHolder(VideoPlaceHolderComponent)
			],
			{
				editable,
				onUpdate,
				onTransaction(props) {
					editor = undefined;
					editor = props.editor;
				}
			}
		);
	});
</script>

<div class={`edra ${className} overflow-auto`}>
	{#if editor}
		<Toolbar {editor} />
	{/if}
	<div
		bind:this={element}
		class="edra-editor prose mx-8 my-4 max-w-full dark:prose-invert *:outline-none"
	></div>
</div>
