<script lang="ts">
	import type { EdraCommand } from '../../commands/types.js';
	import type { Editor } from '@tiptap/core';
	import { icons } from 'lucide-svelte';

	interface Props {
		command: EdraCommand;
		editor: Editor;
		style?: string;
		onclick?: () => void;
	}

	const { command, editor, style, onclick }: Props = $props();

	const Icon = icons[command.iconName];
	const shortcut = command.shortCuts ? ` (${command.shortCuts[0]})` : '';
</script>

<button
	class="edra-command-button"
	class:active={editor.isActive(command.name) || command.isActive?.(editor)}
	onclick={() => {
		if (onclick !== undefined) onclick();
		else command.action(editor);
	}}
	title={`${command.label}${shortcut}`}
	{style}
>
	<Icon class="edra-toolbar-icon" />
</button>
