<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { commands } from '../commands/commands.js';
	import EdraToolBarIcon from './components/EdraToolBarIcon.svelte';
	import SearchAndReplace from './components/SearchAndReplace.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		editor: Editor;
		children?: Snippet<[]>;
	}

	const { class: className = '', editor, children }: Props = $props();

	// Special components that are handled separately
	let showSearchAndReplace = $state(false);
	const colorCommands = commands.colors.commands;
	const fontCommands = commands.fonts.commands;
	const excludedCommands = ['colors', 'fonts'];
</script>

<div class={`edra-toolbar ${className}`}>
	{#if children}
		{@render children()}
	{:else}
		{#if !showSearchAndReplace}
			{#each Object.keys(commands).filter((key) => !excludedCommands.includes(key)) as keys}
				{@const groups = commands[keys].commands}
				{#each groups as command}
					<EdraToolBarIcon {command} {editor} />
				{/each}
				<span class="separator"></span>
			{/each}

			<EdraToolBarIcon command={fontCommands[0]} {editor} />
			<span>{editor.getAttributes('textStyle').fontSize ?? '16px'}</span>
			<EdraToolBarIcon command={fontCommands[1]} {editor} />

			<span class="separator"></span>

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
		<SearchAndReplace {editor} bind:show={showSearchAndReplace} />
	{/if}
</div>
