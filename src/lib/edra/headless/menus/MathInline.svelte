<script lang="ts">
	import { type Editor } from '@tiptap/core';
	import BubbleMenu from '../../components/BubbleMenu.svelte';
	import type { ShouldShowProps } from '../../types.js';
	import CornerDownLeft from '@lucide/svelte/icons/corner-down-left';
	import strings from '../../strings.js';

	interface Props {
		editor: Editor;
		mathPos: number;
		mathLatex: string;
	}

	const { editor, mathPos, mathLatex }: Props = $props();

	let inputVal = $state(mathLatex);

	$effect(() => {
		inputVal = mathLatex;
	});

	function updateLatex() {
		editor.chain().setNodeSelection(mathPos).updateInlineMath({ latex: inputVal }).focus().run();
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
	.edra-bubble-menu-math-inline {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: white;
		border: 1px solid #ccc;
		padding: 0.5rem;
		border-radius: 0.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
	.edra-math-input-inline {
		width: 200px;
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 0.25rem;
		font-family: monospace;
	}
</style>
