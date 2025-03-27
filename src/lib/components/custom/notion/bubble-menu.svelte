<script lang="ts">
	import { commands } from '$lib/edra/commands/commands.js';
	import EdraToolBarIcon from '$lib/edra/shadcn/components/EdraToolBarIcon.svelte';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();

	import { EdraBubbleMenu } from '$lib/edra/shadcn/index.js';
	import type { Editor } from '@tiptap/core';
	import Alignment from './components/alignment.svelte';
	import FontSize from '$lib/edra/shadcn/components/FontSize.svelte';
	import QuickColor from '$lib/edra/shadcn/components/QuickColor.svelte';
	import TurnInto from './components/turn-into.svelte';
	import Ai from './components/ai.svelte';

	const directCommands = [...commands['text-formatting'].commands];
</script>

<EdraBubbleMenu {editor}>
	<Ai {editor} />
	{#each directCommands as command}
		<EdraToolBarIcon class="size-8 p-0" {command} {editor} />
	{/each}
	<Alignment {editor} />
	<FontSize class="h-8 w-fit" {editor} />
	<QuickColor class="h-8 w-fit gap-0.5 p-2" {editor} />
	<TurnInto {editor} />
</EdraBubbleMenu>
