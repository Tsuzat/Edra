<script lang="ts">
	import { browser } from '$app/environment';
	import type { Content, Editor } from '@tiptap/core';
	import Edra from '$lib/edra/shad-edra/editor.svelte';
	import type { Transaction } from '@tiptap/pm/state';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let content = $state<Content>();

	let showToolBar = $state(true);
	let showMenu = $state(true);

	if (browser) {
		let rawData: Content = JSON.parse(localStorage.getItem('edra-content') ?? '{}');
		content = rawData;
	}

	function onUpdate(props: { editor: Editor; transaction: Transaction }) {
		localStorage.setItem('edra-content', JSON.stringify(props.editor.getJSON()));
	}
</script>

<div class="flex flex-col items-center justify-center *:my-4">
	<h1 class="animate-pulse text-center text-4xl font-extrabold">Edra</h1>
	<span class="animate-bounce text-muted-foreground">
		Best Rich Text Editor, made for <strong class="text-foreground"> Svelte Developers </strong>
		with
		<strong class="text-foreground"> Tiptap </strong>
	</span>
	<span class="w-full text-center text-muted-foreground sm:w-[35rem]">
		A Rich Text Editor made with Tiptap for Svelte Developers with extensibility and proper data
		output. Focused on ease of use and copied to your project as an component, with beautiful
		default UI
	</span>
	<div class="flex items-center gap-4">
		<div class="flex items-center gap-2">
			<Checkbox id="toolbar" bind:checked={showToolBar} />
			<Label for="toolbar" class="text-sm font-medium leading-none">Show Editor Toolbar</Label>
		</div>
		<div class="flex items-center gap-2">
			<Checkbox id="menus" bind:checked={showMenu} />
			<Label for="menus" class="text-sm font-medium leading-none">Show Editor Menus</Label>
		</div>
	</div>
	<Edra
		class="m-auto h-[35rem] w-[95%] rounded border sm:w-[80%]"
		{showToolBar}
		{showMenu}
		bind:content
		{onUpdate}
	/>
</div>

<style>
	:global(.edra-toolbar) {
		width: 100%;
		border-bottom-width: 1px;
		padding: 0.25rem;
	}
</style>
