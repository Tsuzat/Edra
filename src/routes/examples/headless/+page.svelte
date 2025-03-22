<script lang="ts">
	import { browser } from '$app/environment';
	import type { Content, Editor } from '@tiptap/core';
	import type { Transaction } from '@tiptap/pm/state';
	import { Edra, EdraToolbar } from '$lib/edra/headless/index.js';
	import { slide } from 'svelte/transition';
	import defaultContent from '$lib/default_content.js';

	// Editor states
	let content = $state<Content>();
	let editor = $state<Editor>();
	let showToolBar = $state(true);
	let showBubbleMenu = $state(true);
	let showSlashCommands = $state(true);

	$effect(() => {
		console.log('Content', content);
		localStorage.setItem('edra-content', JSON.stringify(content));
	});

	if (browser) {
		const rawDataString = localStorage.getItem('edra-content');

		if (rawDataString === null) {
			content = defaultContent;
		} else {
			const rawData: Content = JSON.parse(rawDataString);
			content = rawData;
		}
	}

	function onUpdate(props: { editor: Editor; transaction: Transaction }) {
		content = props.editor.getJSON();
	}
</script>

<div class="py-4 text-center text-xl font-bold">Headless Example</div>
<div class="mx-auto w-[95%] px-4">
	{#if editor && showToolBar}
		<div class="rounded-t border-x border-t p-1">
			<EdraToolbar {editor} allowedCommands={['bulletList', 'headings', 'quickColor']} />
		</div>
	{/if}
	<div class="rounded-b border">
		<Edra
			class="h-64 overflow-auto"
			bind:editor
			{showBubbleMenu}
			{content}
			{onUpdate}
			{showSlashCommands}
			allowedBubbleMenuCommands={['link', 'bulletList', 'headings', 'quickColor']}
		/>
	</div>
</div>
