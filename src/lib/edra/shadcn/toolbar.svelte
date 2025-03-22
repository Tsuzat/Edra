<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { commands } from '../commands/commands.js';
	import EdraToolBarIcon from './components/EdraToolBarIcon.svelte';
	import QuickColor from './components/QuickColor.svelte';
	import FontSize from './components/FontSize.svelte';
	import SearchAndReplace from './components/SearchAndReplace.svelte';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils.js';

	interface Props {
		class?: string;
		editor: Editor;
		allowedCommands?: string[];
		children: Snippet;
	}

	const { class: className = '', editor, allowedCommands, children }: Props = $props();

	// Special components that are handled separately
	const specialComponents = ['fontSize', 'quickColor', 'searchAndReplace'];
	const toolbarItems = getOrderedToolbarItems() as Array<{ type: string; command?: any }>;

	// Function to get ordered toolbar items based on allowedCommands
	function getOrderedToolbarItems() {
		if (!allowedCommands?.length) {
			return [
				...Object.values(commands).flatMap((group) =>
					group.commands.map((cmd) => ({ type: 'command', command: cmd }))
				),
				...specialComponents.map((comp) => ({ type: comp }))
			];
		}

		return allowedCommands
			.map((cmdName) => {
				if (specialComponents.includes(cmdName)) {
					return { type: cmdName };
				}
				// Check if it's a group
				if (commands[cmdName]) {
					return commands[cmdName].commands.map((cmd) => ({
						type: 'command',
						command: cmd
					}));
				}
				// Find individual command
				const command = Object.values(commands)
					.flatMap((group) => group.commands)
					.find((cmd) => cmd.name === cmdName);

				return command ? { type: 'command', command } : null;
			})
			.flat()
			.filter(Boolean);
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
	{@render children?.()}
</div>
