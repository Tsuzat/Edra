<script lang="ts">
	import { browser } from '$app/environment';
	import { Edra } from '$lib/edra/index.js';
	import type { Content } from '@tiptap/core';

	let content = $state<Content>();

	if (browser) {
		let rawData: Content = JSON.parse(localStorage.getItem('edra-content') ?? '{}');
		content = rawData;
	}

	$effect(() => {
		console.log('Content = ', content);
		if (content) {
			localStorage.setItem('edra-content', JSON.stringify(content));
		}
	});
</script>

<main class="inline-flex size-full items-center justify-center">
	<Edra bind:content />
</main>

<style>
	:global(.edra) {
		width: 80%;
		height: 30rem;
		overflow: auto;
	}
</style>
