<script lang="ts">
	import { resolve } from '$app/paths';
	import ToggleMode from '$lib/components/custom/ToggleMode.svelte';
	import { createEditor, Edra, type Content } from '$lib/edra/shadcn/index.js';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowLeft } from '@lucide/svelte';

	let words = $state(0);
	const onUpdate = () => {
		localStorage.setItem('edra-content', JSON.stringify(editor?.getJSON()));
	};
	const editor = createEditor({
		onUpdate
	});
	editor?.on('transaction', () => {
		words = editor.storage.characterCount.words();
	});

	onMount(() => {
		const content = JSON.parse(localStorage.getItem('edra-content') || '[]') as Content;
		editor?.commands.setContent(content, { contentType: 'json' });
	});
</script>

<svelte:head>
	<title>Simple Focus Template | Edra</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-background text-foreground">
	<header
		class="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-background/80 px-6 backdrop-blur"
	>
		<div class="flex items-center gap-3">
			<Button variant="ghost" size="icon" href={resolve('/')} class="nodefault">
				<ArrowLeft class="size-4" />
			</Button>
			<span class="text-sm font-semibold">Distraction-Free Editor</span>
		</div>
		<div class="flex items-center gap-4">
			<ToggleMode />
		</div>
	</header>

	<main class="flex flex-1 justify-center px-6 py-16">
		<div class="w-full max-w-5xl rounded-lg border transition-all duration-500">
			<Edra {editor}>
				<Edra.Toolbar
					class="h-fit max-w-full scrollbar-none overflow-x-scroll rounded-t-lg border-b bg-muted p-1 dark:bg-muted/50"
				/>
				<Edra.Content
					class="h-150 w-full cursor-auto overflow-y-scroll px-8 py-4 text-base *:outline-none"
				/>
				<Edra.DragHandle />
			</Edra>
		</div>
	</main>

	<footer
		class="sticky bottom-0 flex items-center justify-between border-t bg-muted/40 px-6 py-3 text-xs text-muted-foreground select-none"
	>
		<span class="flex items-center gap-1.5">
			<span class="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
			Clean writing environment
		</span>
		<span>{words} words</span>
	</footer>
</div>
