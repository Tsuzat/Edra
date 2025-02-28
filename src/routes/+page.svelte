<script lang="ts">
	import { browser } from '$app/environment';
	import Icons from '$lib/components/custom/icons/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import ShadEditor from '$lib/shad-editor/shad-editor.svelte';
	import { writable, type Writable } from 'svelte/store';
	import defaultContent from '$lib/static/default_data.json' assert { type: 'json' };
	import type { Content } from '@tiptap/core';
	import BorderBeam from '$lib/components/custom/BorderBeam.svelte';
	import AnimatedBlob from '$lib/components/custom/AnimatedBlob.svelte';

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

<div class="relative flex w-full flex-col items-center justify-around *:my-4">
	<div class="blobs relative -z-20 w-full">
		<AnimatedBlob class="left-1/2 top-0 bg-yellow-300 dark:bg-yellow-900" />
		<AnimatedBlob
			class="animation-delay-2000 left-[calc(50%-10rem)] top-0 bg-pink-300 dark:bg-pink-900 sm:left-[calc(50%-20rem)]"
		/>
		<AnimatedBlob
			class="animation-delay-4000 -bottom-40 left-[calc(50%-5rem)] top-10 bg-purple-300 dark:bg-purple-900 sm:left-[calc(50%-10rem)]"
		/>
	</div>

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
	<div class="relative z-30 h-[calc(90dvh)] w-[95%] sm:h-[40rem] sm:w-[90%]">
		<BorderBeam size={100} class="rounded" />
		<ShadEditor class="h-full w-full overflow-auto" bind:content={$content} />
	</div>
</div>
