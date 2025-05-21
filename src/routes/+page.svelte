<script lang="ts">
	import EdraEditor from '$lib/edra/shadcn/editor.svelte';
	import Toolbar from '$lib/edra/shadcn/toolbar.svelte';
	import { Editor } from '@tiptap/core';
	let editor = $state<Editor>();
</script>

<main class="mx-auto my-auto flex max-w-4xl flex-col items-center justify-center">
	<div class="mt-12 size-full rounded-md border border-dashed">
		{#if editor}
			<Toolbar class="w-full border-b border-dashed" {editor} />
		{/if}
		<EdraEditor bind:editor class="h-80" />
	</div>
</main>
