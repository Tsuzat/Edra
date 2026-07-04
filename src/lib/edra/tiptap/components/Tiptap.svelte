<script lang="ts">
	import type { Editor } from '../Editor.js';
	import { setEditor } from './editorContext.js';
	import type { Snippet } from 'svelte';

	let { editor, children }: { editor: Editor | undefined; children?: Snippet } = $props();

	if (editor) {
		setEditor(editor);
	}
</script>

{#if editor && children}
	{@render children()}
{/if}
