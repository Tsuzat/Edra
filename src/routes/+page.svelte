<script lang="ts">
	import { browser } from '$app/environment';
	import type { Content, Editor } from '@tiptap/core';
	import Edra from '$lib/edra/shad-edra/editor.svelte';
	import type { Transaction } from '@tiptap/pm/state';

	let content = $state<Content>();

	if (browser) {
		let rawData: Content = JSON.parse(localStorage.getItem('edra-content') ?? '{}');
		content = rawData;
	}

	function onUpdate(props: { editor: Editor; transaction: Transaction }) {
		localStorage.setItem('edra-content', JSON.stringify(props.editor.getJSON()));
	}
</script>

<main class="flex size-full flex-grow flex-col items-center justify-center overflow-auto">
	<h1 class="my-4 animate-pulse text-center text-4xl font-extrabold">E D R A</h1>
	<Edra class="m-auto h-[35rem] w-[95%] rounded border sm:w-[80%]" bind:content {onUpdate} />
</main>

<style>
	:global(.edra-toolbar) {
		width: 100%;
		border-bottom-width: 1px;
		padding: 0.25rem;
	}
</style>
