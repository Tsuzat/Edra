<script lang="ts">
	import { browser } from '$app/environment';
	import type { Content, Editor } from '@tiptap/core';
	import Edra from '$lib/edra/shad-edra/editor.svelte';
	import type { Transaction } from '@tiptap/pm/state';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { cn } from '$lib/utils.js';

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

<main class="flex size-full flex-grow flex-col items-center justify-center overflow-auto">
	<h1 class="my-4 animate-pulse text-center text-4xl font-extrabold">E D R A</h1>
	<div class="flex items-center gap-4">
		<div class="flex items-center gap-2">
			<Checkbox id="terms" bind:checked={showToolBar} />
			<Label
				id="terms-label"
				for="terms"
				class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				Show Editor Toolbar
			</Label>
		</div>
		<div class="flex items-center gap-2">
			<Checkbox id="terms" bind:checked={showMenu} />
			<Label
				id="terms-label"
				for="terms"
				class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				Show Editor Menus
			</Label>
		</div>
	</div>
	<Edra
		class="m-auto h-[35rem] w-[95%] rounded border sm:w-[80%]"
		{showToolBar}
		{showMenu}
		bind:content
		{onUpdate}
	/>
</main>

<style>
	:global(.edra-toolbar) {
		width: 100%;
		border-bottom-width: 1px;
		padding: 0.25rem;
	}
</style>
