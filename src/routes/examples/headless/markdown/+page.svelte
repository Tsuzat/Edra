<script lang="ts">
	import { browser } from '$app/environment';
	import type { Content, Editor } from '@tiptap/core';
	import { EdraEditor, EdraToolBar } from '$lib/edra/headless/index.js';
	import DragHandle from '$lib/edra/components/DragHandle.svelte';
	import { getMarkdown } from '$lib/edra/utils.js';

	const STORAGE_KEY = 'edra-headless-markdown-content';
	const DEFAULT_CONTENT: Content = `<h1>Markdown mode (headless)</h1>
<p>This is the <strong>headless</strong> flavor — same Markdown-compatible feature set, plain CSS toolbar.</p>
<h2>What's supported</h2>
<ul>
	<li><p><strong>Bold</strong>, <em>italic</em>, <s>strike</s>, <code>inline code</code></p></li>
	<li><p>Bullet, ordered, and task lists</p></li>
	<li><p>Blockquotes, code blocks, tables, images</p></li>
	<li><p>Slash menu — type <code>/</code> to insert</p></li>
</ul>
<blockquote><p>Try editing this content. Read the output with <code>getMarkdown(editor)</code>.</p></blockquote>`;

	let content = $state<Content>(DEFAULT_CONTENT);
	let editor = $state<Editor>();

	if (browser) {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			try {
				content = JSON.parse(saved);
			} catch {
				content = DEFAULT_CONTENT;
			}
		}
	}

	function onUpdate() {
		if (!editor || !browser) return;
		content = editor.getJSON();
		localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
		// Markdown output is also available:
		// const md = getMarkdown(editor);
		console.debug('[markdown]', getMarkdown(editor));
	}
</script>

<div class="bg-background z-50 mx-auto mt-12 size-full max-w-5xl rounded-md border border-dashed">
	{#if editor && !editor.isDestroyed}
		<EdraToolBar {editor} markdown />
		<DragHandle {editor} />
	{/if}
	<div class="h-[30rem] overflow-y-scroll border pr-2 pl-6">
		<EdraEditor bind:editor {content} {onUpdate} markdown />
	</div>
</div>
