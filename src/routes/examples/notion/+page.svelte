<script lang="ts">
	import { browser } from '$app/environment';
	import {
		EdraEditor,
		EdraDragHandleExtended as DragHandle,
		EdraBubbleMenu,
		ToC
	} from '$lib/edra/shadcn/index.js';
	import type { Content, Editor } from '@tiptap/core';
	import defaultContent from '$lib/default_content.js';

	// Editor states
	let content = $state<Content>();
	let editor = $state<Editor>();
	let editable = $state(true);

	$effect(() => {
		localStorage.setItem('edra-content', JSON.stringify(content));
	});

	$effect(() => {
		editor?.setEditable(editable);
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

<div class="h-full w-full">
	{#if editor && editable}
		<DragHandle {editor} />
		<EdraBubbleMenu {editor} />
		<ToC {editor} />
	{/if}
	<EdraEditor
		class="mx-auto h-full w-full max-w-3xl overflow-auto"
		bind:editor
		{editable}
		{content}
		{onUpdate}
	/>
</div>

<style>
	:global(.edra-editor) {
		padding: 0 !important;
	}
</style>
