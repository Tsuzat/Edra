<script lang="ts">
	import { browser } from '$app/environment';
	import type { Content, Editor } from '@tiptap/core';
	import type { Transaction } from '@tiptap/pm/state';
	import { Edra, EdraToolbar, EdraBubbleMenu } from '$lib/edra/shadcn/index.js';
	import defaultContent from '$lib/default_content.js';
	import FontSize from '$lib/edra/shadcn/components/FontSize.svelte';
	import DragHandle from '$lib/edra/drag-handle.svelte';

	// Editor states
	let content = $state<Content>();
	let editor = $state<Editor>();
	let showToolBar = $state(true);
	let showSlashCommands = $state(true);
	let showLinkBubbleMenu = $state(true);
	let showTableBubbleMenu = $state(true);

	$effect(() => {
		$inspect('[DEBUG] Content', content);
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

<div class="w-7xl mx-auto grid grid-cols-3 px-6 py-4">
	<div class="col-start-2 text-center text-xl font-bold">Shadcn Example</div>
	<div class="text-right">
		<a class="text-sm text-muted-foreground hover:underline" href="/examples/headless"
			>View headless example</a
		>
	</div>
</div>

<div class="w-7xl mx-auto px-4">
	{#if editor && showToolBar}
		<div class="rounded-t border-x border-t p-1">
			<!-- Default Edra toolbar -->
			<EdraToolbar {editor} />

			<!-- Customized Edra toolbar -->
			<EdraToolbar {editor}>
				<div class="border-r px-3 text-sm">Customized toolbar</div>
				<FontSize {editor} />
			</EdraToolbar>
		</div>
		<!-- Add bubble menu -->
		<EdraBubbleMenu {editor} />
		<DragHandle {editor} />
	{/if}
	<div class="rounded-b border">
		<Edra
			class="h-80 overflow-auto"
			bind:editor
			{content}
			{showSlashCommands}
			{showLinkBubbleMenu}
			{showTableBubbleMenu}
			{onUpdate}
		/>
	</div>
</div>
