<script lang="ts">
	import { getEditor } from './editorContext.js';
	import EditorContent from './EditorContent.svelte';

	let { class: className }: { class: string } = $props();

	const editor = getEditor();
</script>

<EditorContent {editor} class={className} />
