<script lang="ts">
	import commands from '$lib/edra/commands/toolbar-commands.js';
	import ToolBarIcon from '$lib/edra/shadcn/components/ToolBarIcon.svelte';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();

	import { EdraBubbleMenu } from '$lib/edra/shadcn/index.js';
	import type { Editor } from '@tiptap/core';
	import FontSize from '$lib/edra/shadcn/components/toolbar/FontSize.svelte';
	import QuickColor from '$lib/edra/shadcn/components/toolbar/QuickColors.svelte';
	import Ai from './components/ai.svelte';
	import Alignment from '$lib/edra/shadcn/components/toolbar/Alignment.svelte';

	const directCommands = commands['text-formatting'];
</script>

<EdraBubbleMenu {editor}>
	<Ai {editor} />
	{#each directCommands as command}
		<ToolBarIcon {command} {editor} />
	{/each}
	<Alignment {editor} />
	<FontSize class="h-8 w-fit" {editor} />
	<QuickColor class="h-8 w-fit gap-0.5 p-2" {editor} />
</EdraBubbleMenu>
