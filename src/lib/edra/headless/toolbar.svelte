<script lang="ts">
	import commands from '../commands/toolbar-commands.js';
	import type { EdraToolbarProps } from '../types.js';
	import FontSize from './components/toolbar/FontSize.svelte';
	import QuickColors from './components/toolbar/QuickColors.svelte';
	import SearchAndReplace from './components/toolbar/SearchAndReplace.svelte';
	import ToolBarIcon from './components/ToolBarIcon.svelte';

	const { editor, class: className, excludedCommands }: EdraToolbarProps = $props();

	const toolbarCommands = Object.keys(commands).filter((key) => !excludedCommands?.includes(key));
</script>

<div class={`edra-toolbar ${className}`}>
	{#each toolbarCommands as cmd (cmd)}
		{@const commandGroup = commands[cmd]}
		{#each commandGroup as command (command)}
			<ToolBarIcon {editor} {command} />
		{/each}
	{/each}
	<FontSize {editor} />
	<QuickColors {editor} />
	<SearchAndReplace {editor} />
</div>
