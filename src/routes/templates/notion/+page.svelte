<script lang="ts">
	import { resolve } from '$app/paths';
	import ToggleMode from '$lib/components/custom/ToggleMode.svelte';
	import { createEditor, Edra, type Content } from '$lib/edra/shadcn/index.js';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowLeft, Columns2 } from '@lucide/svelte';
	import { cn } from '$lib/utils.js';

	let pageTitle = $state('Notion-Like Workspace');
	let fullWidth = $state(false);

	// Mock covers list
	const covers = [
		'from-pink-500 via-red-500 to-yellow-500',
		'from-green-400 to-blue-600',
		'from-purple-600 to-indigo-600',
		'from-indigo-400 via-purple-400 to-pink-400'
	];
	let activeCoverIndex = $state(0);

	function changeCover() {
		activeCoverIndex = (activeCoverIndex + 1) % covers.length;
	}
	const onUpdate = () => {
		localStorage.setItem('edra-content', JSON.stringify(editor?.getJSON()));
	};
	/** Sample mock callAI for testing — streams a generic paragraph word-by-word */
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

	const editor = createEditor({
		onUpdate,
		callAI: sampleCallAI
	});

	onMount(() => {
		const content = JSON.parse(localStorage.getItem('edra-content') || '[]') as Content;
		editor?.commands.setContent(content, { contentType: 'json' });
	});
</script>

<svelte:head>
	<title>{pageTitle || 'Untitled'} | Edra Workspace</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-background text-foreground">
	<!-- Workspace Sticky Header -->
	<header
		class="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-background/80 px-6 backdrop-blur"
	>
		<div class="flex items-center gap-3">
			<Button variant="ghost" size="icon" href={resolve('/')} class="nodefault">
				<ArrowLeft class="size-4" />
			</Button>
			<span class="max-w-40 truncate text-sm font-semibold md:max-w-64"
				>{pageTitle || 'Untitled'}</span
			>
		</div>
		<div class="flex items-center gap-2">
			<!-- Full Width Toggle -->
			<Button
				variant="ghost"
				size="sm"
				onclick={() => (fullWidth = !fullWidth)}
				class="h-8 gap-1.5 text-xs"
			>
				<Columns2 class="size-3.5" />
				<span>{fullWidth ? 'Standard Width' : 'Full Width'}</span>
			</Button>
			<ToggleMode />
		</div>
	</header>

	<!-- Notion Style Cover Area -->
	<div
		class={cn(
			'group relative h-48 w-full bg-linear-to-r transition-all! duration-500!',
			covers[activeCoverIndex]
		)}
	>
		<Button
			variant="outline"
			size="sm"
			onclick={changeCover}
			class="absolute right-6 bottom-4 h-8 border bg-background/90 text-xs opacity-0 shadow-xs transition-opacity group-hover:opacity-100 hover:bg-background"
		>
			Change cover
		</Button>
	</div>

	<!-- Workspace Layout -->
	<main class="flex-1 grow overflow-y-auto pb-32">
		<!-- Notion Header Title Input -->
		<div
			class={cn(
				'mx-auto mb-6 border-b border-border/40 px-8 pt-10 pb-4 transition-all duration-300 md:px-16',
				fullWidth ? 'max-w-full' : 'max-w-3xl'
			)}
		>
			<input
				type="text"
				bind:value={pageTitle}
				class="w-full border-hidden bg-transparent text-4xl font-bold tracking-tight outline-hidden placeholder:opacity-20 focus:ring-0"
				placeholder="Untitled Workspace"
			/>
		</div>

		<Edra {editor}>
			<Edra.UseAI />
			<Edra.ToC />
			<Edra.BubbleMenu />
			<Edra.Content
				class={cn(
					'mx-auto w-full cursor-auto px-8 py-4 text-base transition-all duration-300 *:outline-none',
					fullWidth ? 'max-w-full' : 'max-w-3xl'
				)}
			/>
			<Edra.DragHandle type="extended" class="transition-all! duration-300!" />
		</Edra>
	</main>
</div>
