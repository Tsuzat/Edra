<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { commands } from '../commands/commands.js';
	import EdraToolBarIcon from './components/EdraToolBarIcon.svelte';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();
</script>

<div class="edra-toolbar flex h-fit w-fit items-center gap-1 overflow-x-auto overflow-y-hidden">
	{#each Object.keys(commands).filter((key) => key !== 'colors' && key !== 'fonts') as keys}
		{@const groups = commands[keys].commands}
		{#each groups as command}
			<EdraToolBarIcon {command} {editor} />
		{/each}
	{/each}
</div>
