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
</script>

<div
	class={cn(
		'edra-toolbar flex h-fit w-fit items-center gap-1 overflow-x-auto overflow-y-hidden',
		className
	)}
>
	{#each Object.keys(commands) as groupKey}
		{#if commands[groupKey]}
			{#each commands[groupKey].commands as command}
				{#if !allowedCommands || allowedCommands.includes(groupKey) || allowedCommands.includes(command.name)}
					<EdraToolBarIcon {command} {editor} />
				{/if}
			{/each}
		{/if}
	{/each}

	{#if !allowedCommands || allowedCommands.length === 0 || allowedCommands.includes('fontSize')}
		<FontSize {editor} />
	{/if}
	{#if !allowedCommands || allowedCommands.length === 0 || allowedCommands.includes('quickColor')}
		<QuickColor {editor} />
	{/if}
	{#if !allowedCommands || allowedCommands.length === 0 || allowedCommands.includes('searchAndReplace')}
		<SearchAndReplace {editor} />
	{/if}
</div>
