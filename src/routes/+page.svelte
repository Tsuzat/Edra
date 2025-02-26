<script lang="ts">
	import { browser } from '$app/environment';
	import { Edra } from '$lib/edra/index.js';
	import type { Content } from '@tiptap/core';
	import { onMount } from 'svelte';

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

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<Edra bind:content />
