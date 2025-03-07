<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { commands } from '../commands/commands.js';
	import EdraToolBarIcon from './components/EdraToolBarIcon.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();
</script>

<div class="edra-toolbar flex h-fit w-fit items-center gap-1 overflow-auto">
	{#each Object.keys(commands).filter((key) => key !== 'colors' && key !== 'fonts') as keys}
		{@const groups = commands[keys].commands}
		{#each groups as command}
			<EdraToolBarIcon {command} {editor} />
		{/each}
	{/each}
</div>
