<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { commands } from '../commands/commands.js';
	import EdraToolBarIcon from './components/EdraToolBarIcon.svelte';
	import SearchAndReplace from './components/SearchAndReplace.svelte';

	interface Props {
		class?: string;
		editor: Editor;
		allowedCommands?: string[];
	}

	const { class: className = '', editor, allowedCommands }: Props = $props();

	// Special components that are handled separately
	const specialComponents = ['fontSize', 'quickColor', 'searchAndReplace'];
	const toolbarItems = getOrderedToolbarItems() as Array<{ type: string; command?: any }>;
	let showSearchAndReplace = $state(false);
	const colorCommands = commands.colors.commands;
	const fontCommands = commands.fonts.commands;

	// Function to get ordered toolbar items based on allowedCommands
	function getOrderedToolbarItems() {
		// If no allowedCommands provided, return all commands
		if (!allowedCommands || allowedCommands.length === 0) {
			const items = [];

			// Add all regular commands first
			Object.keys(commands).forEach((groupKey) => {
				if (commands[groupKey]) {
					commands[groupKey].commands.forEach((command) => {
						items.push({ type: 'command', command });
					});
				}
			});

			// Append special commands
			items.push({ type: 'fontSize' });
			items.push({ type: 'quickColor' });
			items.push({ type: 'searchAndReplace' });
			return items;
		}

		// If allowedCommands is provided, return items in the specified order
		return allowedCommands
			.map((cmdName) => {
				// Handle special components
				if (specialComponents.includes(cmdName)) {
					return { type: cmdName };
				}

				// Check for group
				if (commands[cmdName]) {
					return commands[cmdName].commands.map((command) => ({
						type: 'command',
						command
					}));
				}

				// Check for individual command from any group
				for (const groupKey in commands) {
					const command = commands[groupKey].commands.find((cmd) => cmd.name === cmdName);
					if (command) {
						return { type: 'command', command };
					}
				}
				return null;
			})
			.flat()
			.filter(Boolean); // Remove null values
	}
</script>

<div class={`edra-toolbar ${className}`}>
	{#if !showSearchAndReplace}
		{#each toolbarItems as item}
			{#if item.type === 'command'}
				<EdraToolBarIcon command={item.command} {editor} />
			{:else if item.type === 'fontSize'}
				<EdraToolBarIcon command={fontCommands[0]} {editor} />
				<span>{editor.getAttributes('textStyle').fontSize ?? '16px'}</span>
				<EdraToolBarIcon command={fontCommands[1]} {editor} />
			{:else if item.type === 'quickColor'}
				<EdraToolBarIcon
					command={colorCommands[0]}
					{editor}
					style={`color: ${editor.getAttributes('textStyle').color};`}
					onclick={() => {
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
					}}
				/>
			{:else if item.type === 'searchAndReplace'}
				<EdraToolBarIcon
					command={colorCommands[1]}
					{editor}
					style={`background-color: ${editor.getAttributes('highlight').color};`}
					onclick={() => {
						const hasHightlight = editor.isActive('highlight');
						if (hasHightlight) {
							editor.chain().focus().unsetHighlight().run();
						} else {
							const color = prompt('Enter the color of the highlight:');
							if (color !== null) {
								editor.chain().focus().setHighlight({ color }).run();
							}
						}
					}}
				/>
			{/if}
		{/each}
	{/if}
	<SearchAndReplace {editor} bind:show={showSearchAndReplace} />
</div>
