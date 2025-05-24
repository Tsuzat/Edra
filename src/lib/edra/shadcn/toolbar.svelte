<script lang="ts">
	import { cn } from '$lib/utils.js';
	import commands from '../commands/toolbar-commands.js';
	import type { EdraToolbarProps } from '../types.js';
	import ToolBarIcon from './components/ToolBarIcon.svelte';

	const { editor, class: className, excludedCommands }: EdraToolbarProps = $props();

	const toolbarCommands = Object.keys(commands).filter((key) => !excludedCommands?.includes(key));
</script>

<div class={cn('edra-toolbar', className)}>
	{#each toolbarCommands as cmd (cmd)}
		{@const commandGroup = commands[cmd]}
		{#each commandGroup as command (command)}
			<ToolBarIcon {editor} {command} />
		{/each}
	{/each}
</div>
