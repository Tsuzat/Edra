<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { EdraToolBarCommands } from '../../commands/types.js';
	import type { Editor } from '@tiptap/core';
	import EdraToolTip from './EdraToolTip.svelte';
	import { cn } from '$lib/utils.js';

	interface Props {
		editor: Editor;
		command: EdraToolBarCommands;
	}

	const { editor, command }: Props = $props();
</script>

<EdraToolTip tooltip={command.tooltip ?? ''} shortCut={command.shortCut ?? ''}>
	<Button
		variant="ghost"
		size="icon"
		class={cn(command.isActive?.(editor) && 'bg-muted')}
		onclick={() => command.onClick?.(editor)}
		disabled={command.clickable ? !command.clickable(editor) : false}
	>
		{@const Icon = command.icon}
		<Icon />
	</Button>
</EdraToolTip>
