<script lang="ts">
	import { browser } from '$app/environment';
	import type { Content, Editor } from '@tiptap/core';
	import Edra from '$lib/edra/edra-headless/editor.svelte';
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

<main class="inline-flex size-full items-center justify-center">
	<Edra bind:content {onUpdate} />
</main>

<style>
	:global(.edra) {
		width: 80%;
		height: 30rem;
		overflow: auto;
	}
</style>
