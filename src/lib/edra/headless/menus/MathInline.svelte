<script lang="ts">
	import { type Editor } from '@tiptap/core';
	import BubbleMenu from '../../components/BubbleMenu.svelte';
	import type { ShouldShowProps } from '../../types.js';
	import CornerDownLeft from '@lucide/svelte/icons/corner-down-left';
	import strings from '../../strings.js';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();

	let inputVal = $derived(editor.getAttributes('inlineMath').latex);

	function updateLatex() {
		editor.commands.updateInlineMath({ latex: inputVal });
	}
</script>

<BubbleMenu
	{editor}
	pluginKey="math-inline-bubble-menu"
	shouldShow={(props: ShouldShowProps) => {
		if (!props.editor.isEditable) return false;
		if (!props.state) return false;
		return editor.isActive('inlineMath');
	}}
	class="edra-bubble-menu-math-inline"
>
	<input
		bind:value={inputVal}
		onchange={updateLatex}
		placeholder={strings.menu.math.enterExpressionPlaceholder}
		class="edra-math-input-inline"
	/>
	<button class="edra-command-button" onclick={updateLatex} title="Apply">
		<CornerDownLeft class="edra-toolbar-icon" />
	</button>
</BubbleMenu>

<style>
	.edra-math-input-inline {
		width: 250px;
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 0.25rem;
		font-family: monospace;
	}
</style>
