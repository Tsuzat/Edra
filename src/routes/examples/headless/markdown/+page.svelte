<script lang="ts">
	import { browser } from '$app/environment';
	import type { Editor } from '@tiptap/core';
	import { EdraEditor, EdraToolBar, EdraBubbleMenu } from '$lib/edra/headless/index.js';
	import { getMarkdown } from '$lib/edra/utils.js';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';

	const STORAGE_KEY = 'edra-headless-markdown-content';
	const DEFAULT_CONTENT = `# Markdown mode (headless)

This is the **headless** flavor — same Markdown-compatible feature set, plain CSS toolbar.

## What's supported

- **Bold**, *italic*, ~~strike~~, \`inline code\`
- [Links](https://tiptap.dev)
- Bullet, ordered, and task lists
- Blockquotes, code blocks, tables, images
- Slash menu — type \`/\` to insert

> Try editing this content.
`;

	let initialContent = browser
		? (localStorage.getItem(STORAGE_KEY) ?? DEFAULT_CONTENT)
		: DEFAULT_CONTENT;

	let editor = $state<Editor>();
	let md = $state(initialContent);
	let copied = $state(false);

	function onUpdate() {
		if (!editor) return;
		md = getMarkdown(editor);
		if (browser) localStorage.setItem(STORAGE_KEY, md);
	}

	$effect(() => {
		if (editor && md === initialContent) md = getMarkdown(editor);
	});

	async function copyMarkdown() {
		await navigator.clipboard.writeText(md);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

<div class="mx-auto w-full max-w-7xl px-4 py-8">
	<div class="mb-6">
		<h1 class="text-2xl font-bold tracking-tight">Markdown editor — headless</h1>
		<p class="text-muted-foreground mt-1 text-sm">
			The headless flavor uses plain CSS classes and no shadcn dependencies. Pass
			<code class="bg-muted rounded px-1 py-0.5 text-xs">markdown</code> to
			<code class="bg-muted rounded px-1 py-0.5 text-xs">&lt;EdraEditor /&gt;</code> and
			<code class="bg-muted rounded px-1 py-0.5 text-xs">&lt;EdraToolBar /&gt;</code>; read the
			output with
			<code class="bg-muted rounded px-1 py-0.5 text-xs">getMarkdown(editor)</code>.
		</p>
	</div>

	<div class="grid gap-4 lg:grid-cols-2">
		<div class="bg-background overflow-hidden rounded-lg border shadow-sm">
			<div class="bg-muted/30 flex items-center justify-between border-b px-3 py-2">
				<span class="text-muted-foreground text-xs font-medium tracking-wide uppercase">
					Editor
				</span>
				{#if editor}
					<EdraToolBar {editor} markdown />
				{/if}
			</div>
			{#if editor}
				<EdraBubbleMenu {editor} />
			{/if}
			<div class="h-[32rem] overflow-y-auto px-6 py-4">
				<EdraEditor bind:editor content={initialContent} {onUpdate} markdown autofocus />
			</div>
		</div>

		<div class="bg-background overflow-hidden rounded-lg border shadow-sm">
			<div class="bg-muted/30 flex items-center justify-between border-b px-3 py-2">
				<span class="text-muted-foreground text-xs font-medium tracking-wide uppercase">
					Markdown output
				</span>
				<button
					type="button"
					onclick={copyMarkdown}
					class="hover:bg-muted text-muted-foreground inline-flex h-7 items-center gap-1.5 rounded px-2 text-xs transition-colors"
				>
					{#if copied}
						<Check class="size-3.5" />
						Copied
					{:else}
						<Copy class="size-3.5" />
						Copy
					{/if}
				</button>
			</div>
			<pre
				class="text-foreground bg-muted/10 m-0 h-[32rem] overflow-auto px-6 py-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">{md}</pre>
		</div>
	</div>
</div>
