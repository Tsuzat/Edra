<script lang="ts">
	import { resolve } from '$app/paths';
	import ToggleMode from '$lib/components/custom/ToggleMode.svelte';
	import { createEditor, Edra, type Content } from '$lib/edra/shadcn/index.js';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowLeft } from '@lucide/svelte';

	let words = $state(0);
	async function sampleCallAI(
		_prompt: string,
		onChunk: (chunk: string) => void,
		onError: (error: Error) => void
	) {
		const paragraph =
			'The quick brown fox jumps over the lazy dog. ' +
			'This is a sample paragraph generated for testing purposes. ' +
			'It demonstrates how the AI streaming interface works by delivering content word by word. ' +
			'Each word arrives with a small delay to simulate real-time generation from an AI model.';
		const words = paragraph.split(' ');
		try {
			for (const word of words) {
				await new Promise((r) => setTimeout(r, 100));
				onChunk(word + ' ');
			}
		} catch (error) {
			onError(error instanceof Error ? error : new Error(String(error)));
		}
	}
	const onUpdate = () => {
		localStorage.setItem('edra-content', JSON.stringify(editor?.getJSON()));
	};
	const editor = createEditor({
		onUpdate,
		callAI: sampleCallAI
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
	<title>AI Template | Edra</title>
</svelte:head>

<div class="min-h-screen bg-background text-foreground flex flex-col">
	<header
		class="flex h-14 items-center justify-between px-6 border-b backdrop-blur bg-background/80 sticky top-0 z-50"
	>
		<div class="flex items-center gap-3">
			<Button variant="ghost" size="icon" href={resolve('/')} class="nodefault">
				<ArrowLeft class="size-4" />
			</Button>
			<span class="text-sm font-semibold">AI Editor</span>
		</div>
		<div class="flex items-center gap-4">
			<ToggleMode />
		</div>
	</header>

	<main class="flex-1 flex justify-center py-16 px-6">
		<div class="border rounded-lg transition-all max-w-5xl w-full duration-500">
			<Edra {editor}>
				<Edra.Toolbar
					class="border-b h-fit rounded-t-lg max-w-full scrollbar-none bg-muted dark:bg-muted/50 p-1 overflow-x-scroll"
				/>
				<Edra.UseAI />
				<Edra.Content
					class="*:outline-none text-base cursor-auto h-150 w-full overflow-y-scroll py-4 px-8"
				/>
				<Edra.DragHandle />
			</Edra>
		</div>
	</main>

	<footer
		class="border-t px-6 sticky bottom-0 py-3 bg-muted/40 text-xs text-muted-foreground flex justify-between items-center select-none"
	>
		<span class="flex items-center gap-1.5">
			<span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
			Clean writing environment
		</span>
		<span>{words} words</span>
	</footer>
</div>
