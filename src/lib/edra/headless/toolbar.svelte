<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { commands } from '../commands/commands.js';
	import EdraToolBarIcon from './components/EdraToolBarIcon.svelte';
	import SearchAndReplace from './components/SearchAndReplace.svelte';
	import type { Snippet } from 'svelte';
	import { getOrderedToolbarItems } from '../utils.js';

	interface Props {
		class?: string;
		editor: Editor;
		allowedCommands?: string[];
		children?: Snippet;
	}

	const { class: className = '', editor, allowedCommands, children }: Props = $props();

	// Special components that are handled separately
	const specialComponents = ['fontSize', 'quickColor', 'searchAndReplace'];
	const toolbarItems = getOrderedToolbarItems(allowedCommands, commands, specialComponents) as Array<{ type: string; command?: any }>;
	let showSearchAndReplace = $state(false);
	const colorCommands = commands.colors.commands;
	const fontCommands = commands.fonts.commands;

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
	{@render children?.()}
</div>
