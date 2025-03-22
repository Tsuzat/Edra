<script lang="ts">
	import { browser } from '$app/environment';
	import type { Content, Editor } from '@tiptap/core';
	import type { Transaction } from '@tiptap/pm/state';
	import { Edra, EdraToolbar } from '$lib/edra/shadcn/index.js';
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

<div>
	<div class="py-4 text-center text-xl font-bold">Shadcn Example</div>
	<div class="m-auto flex h-[35rem] w-[95%] flex-col rounded border sm:w-[85%]">
		{#if editor && showToolBar}
			<div transition:slide>
				<EdraToolbar {editor} allowedCommands={['bulletList', 'headings', 'quickColor']} />
			</div>
		{/if}
		<Edra
			class="overflow-auto"
			bind:editor
			{showBubbleMenu}
			{content}
			{onUpdate}
			{showSlashCommands}
            allowedBubbleMenuCommands={['link', 'bulletList', 'headings', 'quickColor']}
		/>
	</div>
</div>

<style>
	:global(.edra-toolbar) {
		width: 100%;
		border-bottom-width: 1px;
		padding: 0.25rem;
	}
</style>
