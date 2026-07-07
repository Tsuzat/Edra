<script lang="ts">
	import AI from './components/menu/AI.svelte';
	import { getEditor } from '$lib/edra/tiptap/index.js';
	import { onMount } from 'svelte';

	let {
		callAI
	}: {
		callAI: (
			prompt: string,
			onChunk: (chunk: string) => void,
			onError: (error: Error) => void
		) => Promise<void>;
	} = $props();

	const editor = getEditor();

	onMount(() => {
		if (editor && editor.storage['ai-highlight']) {
			editor.storage['ai-highlight'].useAI = true;
		}
		return () => {
			if (editor && editor.storage['ai-highlight']) {
				editor.storage['ai-highlight'].useAI = false;
			}
		};
	});
</script>

<AI {callAI} />
