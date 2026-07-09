<script lang="ts">
	import { resolve } from '$app/paths';
	import ToggleMode from '$lib/components/custom/ToggleMode.svelte';
	import { createEditor, Edra, type Content } from '$lib/edra/headless/index.js';
	import { onMount } from 'svelte';

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

	const onUpdate = () => {
		localStorage.setItem('edra-headless-content', JSON.stringify(editor?.getJSON()));
	};
	const editor = createEditor({
		onUpdate,
		callAI: sampleCallAI
	});

	onMount(() => {
		const content = JSON.parse(localStorage.getItem('edra-headless-content') || '[]') as Content;
		editor?.commands.setContent(content, { contentType: 'json' });
	});
</script>

<header class="demo-header">
	<a href={resolve('/')} class="demo-title-link">Edra Headless</a>
	<ToggleMode />
</header>

<div class="demo-container">
	<Edra {editor}>
		<Edra.UseAI />
		<Edra.Toolbar class="demo-toolbar" />
		<Edra.BubbleMenu />
		<Edra.Content class="demo-content" />
		<Edra.DragHandle />
	</Edra>
</div>

<style>
	.demo-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		background-color: var(--edra-canvas);
		border-bottom: 1px solid var(--edra-border);
	}
	.demo-title-link {
		font-weight: 700;
		color: var(--edra-ink);
		text-decoration: none;
	}
	.demo-container {
		border: 1px solid var(--edra-border);
		border-radius: var(--edra-radius-lg);
		max-width: 64rem; /* max-w-5xl */
		margin-left: auto;
		margin-right: auto;
		margin-top: 2rem;
		margin-bottom: 2rem;
		background-color: var(--edra-canvas);
		box-shadow: var(--edra-shadow-3);
		overflow: hidden;
	}
	:global(.demo-toolbar) {
		border-bottom: 1px solid var(--edra-border);
		padding: 4px;
		background-color: var(--edra-canvas-soft) !important;
		overflow-x: scroll;
		max-width: 100% !important;
	}
	:global(.demo-content) {
		cursor: auto;
		padding: 2rem;
		height: 30rem; /* h-120 */
		overflow-y: scroll;
		background-color: var(--edra-canvas);
	}
	:global(.demo-content *:outline-none) {
		outline: none;
	}
</style>
