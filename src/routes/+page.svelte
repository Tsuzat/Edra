<script lang="ts">
	import { browser } from '$app/environment';
	import Particles from '$lib/components/custom/Particles.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { EdraEditor, EdraToolBar, EdraDragHandleExtended } from '$lib/edra/shadcn/index.js';
	import { Editor, type Content } from '@tiptap/core';
	let editor = $state<Editor>();
	let content = $state<Content>();
	import Docs from '@lucide/svelte/icons/file-text';
	import Github from '@lucide/svelte/icons/github';
	import Coffee from '@lucide/svelte/icons/coffee';

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

<main class="relative flex flex-col items-center justify-center gap-8">
	<Particles />
	<h1 class="mt-4 animate-pulse text-4xl font-bold">Edra</h1>
	<div class="text-muted-foreground animate-bounce">
		Best Rich Text Editor, made for
		<strong class="text-foreground">Svelte Developers</strong> with
		<strong class="text-foreground">Tiptap</strong>
	</div>

	<div class="text-muted-foreground max-w-xl text-center text-sm">
		A Rich Text Editor made with Tiptap for Svelte Developers with extensibility and proper data
		output. Focused on ease of use and copied to your project as an component, with beautiful
		default UI
	</div>

	<div class="flex flex-wrap items-center gap-2">
		<Button href="/docs">
			<Docs />
			View Docs
		</Button>
		<Button variant="secondary" href="https://github.com/Tsuzat/Edra" target="_blank">
			<Github />
			Star on Github
		</Button>
		<Button variant="outline" href="https://www.buymeacoffee.com/tsuzat" target="_blank">
			<Coffee />
			Support Us
		</Button>
	</div>

	<div class="bg-background z-50 mt-12 size-full max-w-5xl rounded-md border border-dashed">
		{#if editor && !editor.isDestroyed}
			<EdraToolBar
				class="bg-secondary/50 flex w-full items-center overflow-x-auto border-b border-dashed p-0.5"
				{editor}
			/>
			<EdraDragHandleExtended {editor} />
		{/if}
		<EdraEditor
			bind:editor
			{content}
			class="h-[30rem] max-h-screen overflow-y-scroll pr-2 pl-6"
			{onUpdate}
		/>
	</div>
</main>
