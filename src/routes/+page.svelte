<script lang="ts">
	import { browser } from '$app/environment';
	import DragHandle from '$lib/edra/components/DragHandle.svelte';
	import EdraEditor from '$lib/edra/shadcn/editor.svelte';
	import Toolbar from '$lib/edra/shadcn/toolbar.svelte';
	import { Editor, type Content } from '@tiptap/core';
	let editor = $state<Editor>();
	let content = $state<Content>();

	if (browser) {
		const rawContent = localStorage.getItem('edra-content');
		if (rawContent) {
			content = JSON.parse(rawContent);
		}
	}

	$effect(() => {
		console.log('[DEBUG]', $state.snapshot(content));
		localStorage.setItem('edra-content', JSON.stringify(content));
	});

	function onUpdate() {
		content = editor?.getJSON();
	}
</script>

<main class="mx-auto my-auto flex max-w-4xl flex-col items-center justify-center">
	<div class="mt-12 size-full rounded-md border border-dashed">
		{#if editor && !editor.isDestroyed}
			<Toolbar
				class="flex w-full items-center overflow-x-scroll border-b border-dashed p-0.5"
				{editor}
			/>
			<DragHandle {editor} />
		{/if}
		<EdraEditor bind:editor {content} class="h-96 overflow-y-scroll pr-2 pl-6" {onUpdate} />
	</div>
</main>
