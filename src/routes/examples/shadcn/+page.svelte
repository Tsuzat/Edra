<script lang="ts">
	import { browser } from '$app/environment';
	import type { Content, Editor } from '@tiptap/core';
	import {
		EdraEditor,
		EdraToolBar,
		EdraBubbleMenu,
		EdraDragHandleExtended as DragHandle
	} from '$lib/edra/shadcn/index.js';
	import defaultContent from '$lib/default_content.js';
	import FontSize from '$lib/edra/shadcn/components/toolbar/FontSize.svelte';

	// Editor states
	let content = $state<Content>();
	let editor = $state<Editor>();
	let showToolBar = $state(true);

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

<div class="mx-auto w-7xl px-4">
	{#if editor && showToolBar}
		<div class="rounded-t border-x border-t p-1">
			<!-- Default Edra toolbar -->
			<EdraToolBar {editor} />

			<!-- Customized Edra toolbar -->
			<EdraToolBar {editor}>
				<div class="border-r px-3 text-sm">Customized toolbar</div>
				<FontSize {editor} />
			</EdraToolBar>
		</div>
		<!-- Add bubble menu -->
		<EdraBubbleMenu {editor} class="bg-popover" />
		<DragHandle {editor} />
	{/if}
	<div class="h-[30rem] overflow-y-scroll border pr-2 pl-6">
		<EdraEditor bind:editor {content} {onUpdate} />
	</div>
</div>
