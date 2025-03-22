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

	let showSearchAndReplace = $state(false);

	const colorCommands = commands.colors.commands;
	const fontCommands = commands.fonts.commands;
</script>

<div class={`edra-toolbar ${className}`}>
	{#if !showSearchAndReplace}
		{#each Object.keys(commands) as groupKey}
			{#if commands[groupKey] && commands[groupKey]}
				{#each commands[groupKey].commands as command}
					{#if !allowedCommands || allowedCommands.includes(groupKey) || allowedCommands.includes(command.name)}
						<EdraToolBarIcon {command} {editor} />
					{/if}
				{/each}
			{/if}
		{/each}

		{#if !allowedCommands || allowedCommands.length === 0 || allowedCommands.includes('fontSize')}
			<EdraToolBarIcon command={fontCommands[0]} {editor} />
			<span>{editor.getAttributes('textStyle').fontSize ?? '16px'}</span>
			<EdraToolBarIcon command={fontCommands[1]} {editor} />
		{/if}

		<span class="separator"></span>

		{#if !allowedCommands || allowedCommands.length === 0 || allowedCommands.includes('color')}
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
		{/if}

		{#if !allowedCommands || allowedCommands.length === 0 || allowedCommands.includes('highlight')}
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
	{/if}
	<SearchAndReplace {editor} bind:show={showSearchAndReplace} />
</div>
