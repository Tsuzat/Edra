<script lang="ts">
	import commands, {
		MARKDOWN_COMMAND_GROUPS,
		MARKDOWN_EXCLUDED_COMMANDS
	} from '../commands/toolbar-commands.js';
	import type { EdraToolbarProps } from '../types.js';
	import FontSize from './components/toolbar/FontSize.svelte';
	import QuickColors from './components/toolbar/QuickColors.svelte';
	import SearchAndReplace from './components/toolbar/SearchAndReplace.svelte';
	import ToolBarIcon from './components/ToolBarIcon.svelte';

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

	let show = $state<boolean>(false);
</script>

<div class={`edra-toolbar ${className}`}>
	{#if children}
		{@render children()}
	{:else}
		{#if !show}
			{#each toolbarCommands as cmd (cmd)}
				{@const commandGroup = commands[cmd].filter(
					(c) => !markdown || !MARKDOWN_EXCLUDED_COMMANDS.has(c.name)
				)}
				{#each commandGroup as command (command)}
					<ToolBarIcon {editor} {command} />
				{/each}
			{/each}
			{#if !markdown}
				<FontSize {editor} />
				<QuickColors {editor} />
			{/if}
		{/if}
		<SearchAndReplace {editor} bind:show />
	{/if}
</div>
