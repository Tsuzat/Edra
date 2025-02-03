<script lang="ts">
	import { browser } from '$app/environment';
	import Icons from '$lib/components/custom/icons/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import ShadEditor from '$lib/shad-editor/shad-editor.svelte';
	import { writable, type Writable } from 'svelte/store';
	import defaultContent from '$lib/static/default_data.json' assert { type: 'json' };
	import type { Content } from '@tiptap/core';

	let jsonContent: Content = {};
	if (browser) {
		try {
			let localStorageContent = localStorage.getItem('content');
			if (!localStorageContent) {
				localStorage.setItem('content', JSON.stringify(defaultContent));
				jsonContent = defaultContent;
			} else {
				jsonContent = JSON.parse(localStorageContent);
			}
		} catch (e) {
			console.error('Error on parsing the content', e);
			jsonContent = defaultContent;
		}
	}

	const content: Writable<Content> = writable(jsonContent);

	content.subscribe((value) => {
		if (!browser) return;
		localStorage.setItem('content', JSON.stringify(value));
	});
</script>

<div class="flex w-full flex-col items-center justify-around *:my-4">
	<h1 class="animate-pulse text-4xl font-extrabold">Shad Editor</h1>
	<p class="text-center text-[1.2rem] font-medium text-muted-foreground">
		Made with Svelte, Tiptap and Shadcn UI for <span class="text-foreground">developers</span>
	</p>
	<p class="w-full text-center sm:w-[35rem]">
		An editor with rich text features and a beautiful UI, provides full flexibility and customizable
		components ready to copy and paste, made for developers.
	</p>
	<div>
		<Button class="font-medium" href="/docs">
			<Icons.document /> View Docs
		</Button>
		<Button
			variant="outline"
			class="font-medium"
			href="https://github.com/Tsuzat/ShadEditor"
			target="_blank"
		>
			<Icons.github /> Star on Github
		</Button>
	</div>
	<div class="h-[calc(90dvh)] w-[95%] sm:h-[40rem]">
		<ShadEditor class="h-full w-full overflow-auto" bind:content={$content} />
	</div>
</div>
