<script lang="ts">
	import { browser } from '$app/environment';
	import type { Content, Editor } from '@tiptap/core';
	import { EdraEditor, EdraToolBar, EdraBubbleMenu } from '$lib/edra/shadcn/index.js';
	import { getMarkdown } from '$lib/edra/utils.js';

	let content = $state<Content>('# Hello Markdown\n\nType `/` for the slash menu.');
	let editor = $state<Editor>();
	let md = $state<string>('');

	if (browser) {
		const stored = localStorage.getItem('edra-markdown-content');
		if (stored !== null) content = stored;
	}

	function onUpdate() {
		if (!editor) return;
		md = getMarkdown(editor);
		content = md;
		localStorage.setItem('edra-markdown-content', md);
	}

	$effect(() => {
		if (editor && !md) md = getMarkdown(editor);
	});
</script>

<div class="mx-auto grid w-7xl gap-4 px-4 py-4 lg:grid-cols-2">
	<div>
		{#if editor}
			<div class="rounded-t border-x border-t p-1">
				<EdraToolBar {editor} markdown />
			</div>
			<EdraBubbleMenu {editor} class="bg-popover" />
		{/if}
		<div class="h-[30rem] overflow-y-scroll border pr-2 pl-6">
			<EdraEditor bind:editor {content} {onUpdate} markdown />
		</div>
	</div>
	<div>
		<div class="text-muted-foreground border-b p-2 text-sm">Markdown output</div>
		<pre class="bg-muted/25 h-[32rem] overflow-auto border p-4 text-xs">{md}</pre>
	</div>
</div>
