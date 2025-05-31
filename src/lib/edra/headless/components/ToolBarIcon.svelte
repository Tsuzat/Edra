<script lang="ts">
	import type { EdraToolBarCommands } from '../../commands/types.js';
	import { type Editor } from '@tiptap/core';

	interface Props {
		editor: Editor;
		command: EdraToolBarCommands;
	}

	const { editor, command }: Props = $props();
</script>

{#snippet ToolBarIcon({ command, editor }: Props)}
	{@const Icon = command.icon}
	<button
		class="edra-command-button"
		class:active={command.isActive?.(editor)}
		onclick={() => command.onClick?.(editor)}
		disabled={command.clickable ? !command.clickable(editor) : false}
		title={`${command.tooltip} ${command.shortCut}`}
	>
		<Icon class="edra-toolbar-icon" />
	</button>
{/snippet}

{@render ToolBarIcon({ command, editor })}
