<script lang="ts">
	import { browser } from '$app/environment';
	import type { Content, Editor } from '@tiptap/core';
	import type { Transaction } from '@tiptap/pm/state';
	import { Edra, EdraToolbar, EdraBubbleMenu } from '$lib/edra/headless/index.js';
	import defaultContent from '$lib/default_content.js';
	import EdraToolBarIcon from '$lib/edra/headless/components/EdraToolBarIcon.svelte';
	import { isMac } from '$lib/edra/utils.js';

	// Editor states
	let content = $state<Content>();
	let editor = $state<Editor>();
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
	<div class="col-start-2 text-center text-xl font-bold">Headless Example</div>
	<div class="text-right">
		<a class="text-sm text-muted-foreground hover:underline" href="/examples/shadcn"
			>View shadcn example</a
		>
	</div>
</div>

<div class="w-7xl mx-auto px-4">
	{#if editor}
		<div class="rounded-t border-x border-t p-1">
			<!-- Default Edra toolbar -->
			<EdraToolbar {editor} />

			<!-- Customized Edra toolbar -->
			<EdraToolbar {editor}>
				<div class="border-r px-3 text-sm">Customized toolbar</div>
				<EdraToolBarIcon
					command={{
						iconName: 'Bold',
						name: 'bold',
						label: 'Bold',
						shortCuts: [`${isMac ? 'Cmd' : 'Ctrl'}+B`],
						action: (editor) => {
							editor.chain().focus().toggleBold().run();
						}
					}}
					{editor}
				/>
			</EdraToolbar>
		</div>
		<!-- Add bubble menu -->
		<EdraBubbleMenu {editor} />
	{/if}
	<div class="rounded-b border">
		<Edra
			class="h-64 overflow-auto"
			bind:editor
			{content}
			{showSlashCommands}
			{showLinkBubbleMenu}
			{showTableBubbleMenu}
			{onUpdate}
		/>
	</div>
</div>
