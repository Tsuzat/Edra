<script lang="ts">
	import { browser } from '$app/environment';
	import type { Content, Editor } from '@tiptap/core';
	import { EdraEditor, EdraToolBar, BubbleMenu } from '$lib/edra/headless/index.js';
	import defaultContent from '$lib/default_content.js';
	import EdraToolBarIcon from '$lib/edra/headless/components/ToolBarIcon.svelte';
	import { isMac } from '$lib/edra/utils.js';
	import DragHandle from '$lib/edra/components/DragHandle.svelte';
	import Bold from '@lucide/svelte/icons/bold';

	// Editor states
	let content = $state<Content>();
	let editor = $state<Editor>();

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

	function onUpdate() {
		content = editor?.getJSON();
	}
</script>

<div class="bg-background z-50 mx-auto mt-12 size-full max-w-5xl rounded-md border border-dashed">
	{#if editor && !editor.isDestroyed}
		<EdraToolBar {editor} />

		<!-- Customized Edra toolbar -->
		<EdraToolBar {editor}>
			<div class="border-r px-3 text-sm">Customized toolbar</div>
			<EdraToolBarIcon
				command={{
					icon: Bold,
					name: 'bold',
					tooltip: 'Bold',
					shortCut: isMac ? '⌘+B' : 'Ctrl+B',
					onClick: (editor) => {
						editor.chain().focus().toggleBold().run();
					}
				}}
				{editor}
			/>
		</EdraToolBar>
		<DragHandle {editor} />
	{/if}
	<div class="h-[30rem] overflow-y-scroll border pr-2 pl-6">
		<EdraEditor bind:editor {content} {onUpdate} />
	</div>
</div>
