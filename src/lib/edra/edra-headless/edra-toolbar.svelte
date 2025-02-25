<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { commands } from '../commands/commands.js';
	import { icons } from 'lucide-svelte';

	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();
</script>

<div class="edra-toolbar">
	{#each Object.keys(commands) as keys}
		{@const groups = commands[keys].commands}
		{#each groups as group}
			{@const Icon = icons[group.iconName]}
			{@const shortcut = group.shortCuts ? ` (${group.shortCuts[0]})` : ''}
			<button
				class="edra-command-button"
				class:active={editor.isActive(group.name)}
				onclick={() => group.action(editor)}
				title={`${group.label}${shortcut}`}
			>
				<Icon class="edra-toolbar-icon" />
			</button>
		{/each}
		<span class="separator"></span>
	{/each}
</div>
