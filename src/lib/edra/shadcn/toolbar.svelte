<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { slide } from 'svelte/transition';
	import commands, {
		MARKDOWN_COMMAND_GROUPS,
		MARKDOWN_EXCLUDED_COMMANDS
	} from '../commands/toolbar-commands.js';
	import type { EdraToolbarProps } from '../types.js';
	import ToolBarIcon from './components/ToolBarIcon.svelte';
	import Alignment from './components/toolbar/Alignment.svelte';
	import FontSize from './components/toolbar/FontSize.svelte';
	import Headings from './components/toolbar/Headings.svelte';
	import Link from './components/toolbar/Link.svelte';
	import Lists from './components/toolbar/Lists.svelte';
	import QuickColors from './components/toolbar/QuickColors.svelte';

	const {
		editor,
		class: className,
		excludedCommands,
		children,
		markdown = false
	}: EdraToolbarProps = $props();

	const allowedGroups = markdown
		? (MARKDOWN_COMMAND_GROUPS as readonly string[])
		: Object.keys(commands);
	const toolbarCommands = allowedGroups.filter(
		(key) => key in commands && !excludedCommands?.includes(key)
	);
</script>

<div
	class={cn(
		'edra-toolbar bg-muted/25 mx-auto flex items-center gap-0.5 rounded-lg border-[0.5px] border-dashed',
		className
	)}
	transition:slide
>
	{#if children}
		{@render children()}
	{:else}
		{#each toolbarCommands as cmd (cmd)}
			{#if cmd === 'headings'}
				<Headings {editor} />
			{:else if cmd === 'alignment'}
				<Alignment {editor} />
			{:else if cmd === 'lists'}
				<Lists {editor} />
			{:else if ['media', 'table'].includes(cmd)}
				{@const commandGroup = commands[cmd].filter(
					(c) => !markdown || !MARKDOWN_EXCLUDED_COMMANDS.has(c.name)
				)}
				{#if markdown}
					{#each commandGroup as command (command)}
						<ToolBarIcon {editor} {command} />
					{/each}
				{:else}
					<span></span>
				{/if}
			{:else}
				{@const commandGroup = commands[cmd].filter(
					(c) => !markdown || !MARKDOWN_EXCLUDED_COMMANDS.has(c.name)
				)}
				{#each commandGroup as command (command)}
					{#if command.name === 'link'}
						<Link {editor} />
					{:else if command.name === 'paragraph'}
						<span></span>
					{:else}
						<ToolBarIcon {editor} {command} />
					{/if}
				{/each}
			{/if}
		{/each}
		{#if !markdown}
			<FontSize {editor} />
			<QuickColors {editor} />
		{/if}
	{/if}
</div>
