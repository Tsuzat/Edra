<script lang="ts">
	import { type Editor, type Content, type Extensions, type NodeViewProps } from '@tiptap/core';
	import { onDestroy, onMount, type Component } from 'svelte';

	import EdraToolbar from './edra-toolbar.svelte';
	import { initiateEditor } from '../editor.js';
	import './editor.css';
	import './style.css';

	// Lowlight
	import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
	import { all, createLowlight } from 'lowlight';
	import '../onedark.css';
	import { SvelteNodeViewRenderer } from 'svelte-tiptap';
	import CodeExtended from './components/CodeExtended.svelte';
	import { AudioPlaceHolder } from '../extensions/audio/AudioPlaceholder.js';
	import AudioPlaceHolderComponent from './components/AudioPlaceHolder.svelte';
	import { ImagePlaceHolder } from '../extensions/image/ImagePlaceHolder.js';
	import ImagePlaceHolderComponent from './components/ImagePlaceHolder.svelte';
	import { VideoPlaceHolder } from '../extensions/video/VideoPlaceHolder.js';
	import VideoPlaceHolderComponent from './components/VideoPlaceHolder.svelte';
	import { Audio } from '../extensions/audio/AudioExtension.js';
	import { ImageExtended } from '../extensions/image/ImageExtended.js';
	import ImageExtendedComponent from './components/ImageExtended.svelte';

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
				ImagePlaceHolder(ImagePlaceHolderComponent as unknown as Component<NodeViewProps>),
				VideoPlaceHolder(VideoPlaceHolderComponent as unknown as Component<NodeViewProps>),
				Audio,
				ImageExtended(ImageExtendedComponent),
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
