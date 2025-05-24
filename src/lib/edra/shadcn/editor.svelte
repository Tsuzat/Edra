<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { EdraEditorProps } from '../types.js';
	import initEditor from '../editor.js';
	import { focusEditor } from '../utils.js';
	import { cn } from '$lib/utils.js';
	import '../editor.css';
	import './style.css';
	import '../onedark.css';
	import { ImagePlaceholder } from '../extensions/image/ImagePlaceholder.js';
	import ImagePlaceholderComp from './components/ImagePlaceholder.svelte';

	/**
	 * Bind the element to the editor
	 */
	let element = $state<HTMLElement>();
	let {
		editor = $bindable(),
		editable = true,
		extensions,
		content,
		onUpdate,
		class: className
	}: EdraEditorProps = $props();

	onMount(() => {
		editor = initEditor(element, extensions, [ImagePlaceholder(ImagePlaceholderComp)], {
			onUpdate,
			onTransaction(props) {
				editor = undefined;
				editor = props.editor;
			}
		});
	});

	onDestroy(() => {
		if (editor) editor.destroy();
	});
</script>

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
	class={cn('edra-editor h-full min-w-full cursor-auto p-2 *:outline-none', className)}
></div>
