<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { commands } from '../commands/commands.js';
	import EdraToolBarIcon from './components/EdraToolBarIcon.svelte';
	import QuickColor from './components/QuickColor.svelte';
	import FontSize from './components/FontSize.svelte';
	import SearchAndReplace from './components/SearchAndReplace.svelte';
	import { cn } from '$lib/utils.js';

	interface Props {
		class?: string;
		editor: Editor;
		allowedCommands?: string[];
	}

	const { class: className = '', editor, allowedCommands }: Props = $props();

	// Special components that are handled separately
	const specialComponents = ['fontSize', 'quickColor', 'searchAndReplace'];
	const toolbarItems = getOrderedToolbarItems() as Array<{ type: string; command?: any }>;

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

<div
	class={cn(
		'edra-toolbar flex h-fit w-fit items-center gap-1 overflow-x-auto overflow-y-hidden',
		className
	)}
>
	{#each toolbarItems as item}
		{#if item.type === 'command'}
			<EdraToolBarIcon command={item.command} {editor} />
		{:else if item.type === 'fontSize'}
			<FontSize {editor} />
		{:else if item.type === 'quickColor'}
			<QuickColor {editor} />
		{:else if item.type === 'searchAndReplace'}
			<SearchAndReplace {editor} />
		{/if}
	{/each}
</div>
