<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { commands } from '../commands/commands.js';
	import { icons } from 'lucide-svelte';
	import type { EdraCommand } from '../commands/types.js';

	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();

	const colorCommands = commands.colors.commands;
	const fontCommands = commands.fonts.commands;
</script>

{#snippet EditorTool(group: EdraCommand, style?: string, onclick?: () => void)}
	{@const Icon = icons[group.iconName]}
	{@const shortcut = group.shortCuts ? ` (${group.shortCuts[0]})` : ''}
	<button
		class="edra-command-button"
		class:active={editor.isActive(group.name) || group.isActive?.(editor)}
		onclick={() => {
			if (onclick !== undefined) onclick();
			else group.action(editor);
		}}
		title={`${group.label}${shortcut}`}
		{style}
	>
		<Icon class="edra-toolbar-icon" />
	</button>
{/snippet}

<div class="edra-toolbar">
	{#each Object.keys(commands).filter((key) => key !== 'colors' && key !== 'fonts') as keys}
		{@const groups = commands[keys].commands}
		{#each groups as group}
			{@render EditorTool(group)}
		{/each}
		<span class="separator"></span>
	{/each}

	{@render EditorTool(fontCommands[0])}
	<span>{editor.getAttributes('textStyle').fontSize ?? '16px'}</span>
	{@render EditorTool(fontCommands[1])}

	<span class="separator"></span>

	{@render EditorTool(
		colorCommands[0],
		`color: ${editor.getAttributes('textStyle').color};`,
		() => {
			const color = editor.getAttributes('textStyle').color;
			const hasColor = editor.isActive('textStyle', { color });
			if (hasColor) {
				editor.chain().focus().unsetColor().run();
			} else {
				const color = prompt('Enter the color of the text:');
				if (color !== null) {
					editor.chain().focus().setColor(color).run();
				}
			}
		}
	)}
	{@render EditorTool(
		colorCommands[1],
		`background-color: ${editor.getAttributes('highlight').color};`,
		() => {
			const hasHightlight = editor.isActive('highlight');
			if (hasHightlight) {
				editor.chain().focus().unsetHighlight().run();
			} else {
				const color = prompt('Enter the color of the highlight:');
				if (color !== null) {
					editor.chain().focus().setHighlight({ color }).run();
				}
			}
		}
	)}
</div>
