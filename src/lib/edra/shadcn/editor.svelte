<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { EdraEditorProps } from '../types.js';
	import initEditor from '../editor.js';

	/**
	 * Bind the element to the editor
	 */
	let element = $state<HTMLElement>();
	let {
		editor = $bindable(),
		editable = true,
		extensions,
		content,
		onUpdate
	}: EdraEditorProps = $props();

	onMount(() => {
		editor = initEditor(element, extensions);
	});

	onDestroy(() => {
		if (editor) editor.destroy();
	});
</script>

<div bind:this={element}></div>
