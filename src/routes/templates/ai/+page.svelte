<script lang="ts">
	import { resolve } from '$app/paths';
	import ToggleMode from '$lib/components/custom/ToggleMode.svelte';
	import { createEditor, Edra, type Content } from '$lib/edra/shadcn/index.js';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { ArrowLeft, Sparkles, Send, Brain, Bot, CornerDownLeft, Trash2 } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	let aiPanePrompt = $state('');
	let aiStreamingResult = $state('');
	let isAiGenerating = $state(false);

	/** Streams sample content for testing */
	async function sampleCallAI(
		prompt: string,
		onChunk: (chunk: string) => void,
		onError: (error: Error) => void
	) {
		const paragraph =
			'Artificial intelligence is transforming how we write and create content. ' +
			'By leveraging large language models, editors can automatically draft outlines, ' +
			'summarize complex passages, and iterate on style within seconds. ' +
			'This streams the response directly into the editor view to provide fluid real-time co-authoring.';
		const words = paragraph.split(' ');
		try {
			for (const word of words) {
				await new Promise((r) => setTimeout(r, 80));
				onChunk(word + ' ');
			}
		} catch (error) {
			onError(error instanceof Error ? error : new Error(String(error)));
		}
	}

	const onUpdate = () => {
		if (editor) {
			localStorage.setItem('edra-template-ai-content', JSON.stringify(editor.getJSON()));
		}
	};

	const editor = createEditor({
		onUpdate,
		callAI: sampleCallAI
	});

	onMount(() => {
		const content = JSON.parse(localStorage.getItem('edra-template-ai-content') || '[]') as Content;
		editor?.commands.setContent(content, { contentType: 'json' });
	});

	// Trigger side assistant generation
	async function generateSideAI() {
		if (!aiPanePrompt.trim()) return;
		isAiGenerating = true;
		aiStreamingResult = '';

		const currentPrompt = aiPanePrompt;
		aiPanePrompt = '';

		try {
			await sampleCallAI(
				currentPrompt,
				(chunk) => {
					aiStreamingResult += chunk;
				},
				(err) => {
					toast.error('AI Error: ' + err.message);
				}
			);
		} finally {
			isAiGenerating = false;
		}
	}

	// Insert side pane generation into editor at selection
	function insertResultAtCursor() {
		if (!aiStreamingResult || !editor) return;
		editor.chain().focus().insertContent(aiStreamingResult).run();
		aiStreamingResult = '';
		toast.success('Inserted AI content at cursor.');
	}

	// Clear side pane results
	function clearSidePane() {
		aiStreamingResult = '';
		aiPanePrompt = '';
	}

	// Run preset prompt
	async function runPreset(presetName: string) {
		aiPanePrompt = `Preset: ${presetName}. Process the document content...`;
		await generateSideAI();
	}
</script>

<svelte:head>
	<title>AI Co-Authoring Editor | Edra</title>
</svelte:head>

<div class="min-h-screen bg-background text-foreground flex flex-col">
	<header
		class="flex h-14 items-center justify-between px-6 border-b backdrop-blur bg-background/80 sticky top-0 z-50"
	>
		<div class="flex items-center gap-3">
			<Button variant="ghost" size="icon" href={resolve('/')} class="nodefault">
				<ArrowLeft class="size-4" />
			</Button>
			<span class="text-sm font-semibold flex items-center gap-1.5">
				<Sparkles class="size-4 text-purple-500 fill-purple-500/20" />
				AI Editor Template
			</span>
		</div>
		<div class="flex items-center gap-4">
			<ToggleMode />
		</div>
	</header>

	<div class="flex-1 flex overflow-hidden">
		<!-- Left: Main Editor Panel -->
		<main class="flex-1 overflow-y-auto p-10 flex justify-center border-r">
			<div class="w-full max-w-3xl">
				<Edra {editor}>
					<Edra.UseAI />
					<Edra.Toolbar
						class="border rounded-t-lg bg-muted/40 p-1 flex items-center gap-1 overflow-x-auto"
					/>
					<Edra.Content
						class="*:outline-hidden text-base leading-relaxed cursor-auto min-h-[60vh] border-x border-b rounded-b-lg p-8 bg-card shadow-sm"
					/>
					<Edra.DragHandle />
				</Edra>
			</div>
		</main>

		<!-- Right: AI Assistant Sidebar -->
		<aside class="w-96 flex flex-col bg-muted/30 overflow-y-auto">
			<!-- Header -->
			<div class="p-6 border-b flex items-center gap-2">
				<Brain class="size-5 text-indigo-500" />
				<h2 class="text-sm font-semibold">AI Assistant</h2>
				<span
					class="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground uppercase font-mono tracking-wider bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/25"
				>
					<span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
					Ready
				</span>
			</div>

			<!-- Preset Actions -->
			<div class="p-6 border-b flex flex-col gap-3">
				<span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
					>Quick Actions</span
				>
				<div class="grid grid-cols-2 gap-2">
					<Button
						variant="outline"
						size="sm"
						onclick={() => runPreset('Draft Outline')}
						class="text-xs justify-start h-8"
					>
						<Bot class="size-3.5 mr-1.5 text-purple-500" /> Draft Outline
					</Button>
					<Button
						variant="outline"
						size="sm"
						onclick={() => runPreset('Explain Code')}
						class="text-xs justify-start h-8"
					>
						<Bot class="size-3.5 mr-1.5 text-purple-500" /> Explain Concept
					</Button>
					<Button
						variant="outline"
						size="sm"
						onclick={() => runPreset('Correct Grammar')}
						class="text-xs justify-start h-8"
					>
						<Bot class="size-3.5 mr-1.5 text-purple-500" /> Polish Text
					</Button>
					<Button
						variant="outline"
						size="sm"
						onclick={() => runPreset('Solve Problem')}
						class="text-xs justify-start h-8"
					>
						<Bot class="size-3.5 mr-1.5 text-purple-500" /> Brainstorm
					</Button>
				</div>
			</div>

			<!-- Response Console -->
			<div class="flex-1 p-6 flex flex-col gap-4">
				<span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
					>AI Streaming Output</span
				>

				{#if aiStreamingResult || isAiGenerating}
					<div
						class="flex-1 bg-card border rounded-lg p-4 font-sans text-sm leading-relaxed overflow-y-auto max-h-80 shadow-inner flex flex-col gap-3"
					>
						<p class="whitespace-pre-wrap">{aiStreamingResult}</p>
						{#if isAiGenerating}
							<span
								class="inline-flex items-center gap-1.5 text-xs text-muted-foreground animate-pulse mt-auto"
							>
								<Sparkles class="size-3.5 text-purple-500 animate-spin" />
								AI is writing...
							</span>
						{/if}
					</div>

					<div class="flex gap-2">
						<Button
							size="sm"
							class="flex-1 text-xs"
							onclick={insertResultAtCursor}
							disabled={isAiGenerating}
						>
							<CornerDownLeft class="size-3.5 mr-1.5" /> Insert in Editor
						</Button>
						<Button size="sm" variant="ghost" onclick={clearSidePane} class="h-9 px-3">
							<Trash2 class="size-4" />
						</Button>
					</div>
				{:else}
					<div
						class="flex-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 text-center text-muted-foreground bg-card/50"
					>
						<Bot class="size-8 mb-2 text-muted-foreground/60" />
						<p class="text-xs font-medium">No active generations</p>
						<p class="text-[10px] mt-1 max-w-[200px]">
							Type a prompt below or click a quick action to start generating content.
						</p>
					</div>
				{/if}
			</div>

			<!-- Prompt Form -->
			<div class="p-6 border-t bg-card">
				<form
					onsubmit={(e) => {
						e.preventDefault();
						generateSideAI();
					}}
					class="flex gap-2"
				>
					<Input
						placeholder="Ask AI co-author..."
						bind:value={aiPanePrompt}
						disabled={isAiGenerating}
						class="flex-1 text-xs"
					/>
					<Button
						type="submit"
						size="icon"
						disabled={isAiGenerating || !aiPanePrompt.trim()}
						class="shrink-0 bg-purple-600 hover:bg-purple-700"
					>
						<Send class="size-4 text-white" />
					</Button>
				</form>
			</div>
		</aside>
	</div>
</div>
