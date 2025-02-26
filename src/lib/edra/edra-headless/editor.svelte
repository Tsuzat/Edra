<script lang="ts">
	import { type Editor, type Content, type Extensions } from '@tiptap/core';
	import { onDestroy, onMount } from 'svelte';

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

	const lowlight = createLowlight(all);

	interface Props {
		class?: string;
		content?: Content;
		extensions?: Extensions;
	}

	let { class: className = '', content = $bindable(), extensions }: Props = $props();

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
				...(extensions ?? [])
			],
			{
				onUpdate: (props) => {
					content = props.editor.getJSON();
				},
				onTransaction: (props) => {
					editor = undefined;
					editor = props.editor;
				}
			}
		);
	});

	onDestroy(() => {
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
