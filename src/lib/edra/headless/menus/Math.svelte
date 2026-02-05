<script lang="ts">
	import { type Editor } from '@tiptap/core';
	import BubbleMenu from '../../components/BubbleMenu.svelte';
	import type { ShouldShowProps } from '../../types.js';
	import strings from '../../strings.js';

	interface Props {
		editor: Editor;
		mathPos: number;
		mathLatex: string;
	}

	const { editor, mathPos, mathLatex }: Props = $props();

	let textareaVal = $state(mathLatex);

	$effect(() => {
		textareaVal = mathLatex;
	});

	function updateLatex() {
		editor.commands.updateBlockMath({
			latex: textareaVal,
			pos: mathPos
		});
	}
</script>

<BubbleMenu
	{editor}
	pluginKey="math-bubble-menu"
	shouldShow={(props: ShouldShowProps) => {
		if (!props.editor.isEditable) return false;
		if (!props.state) return false;
		return editor.isActive('blockMath');
	}}
	class="edra-bubble-menu-math"
>
	<textarea
		bind:value={textareaVal}
		oninput={updateLatex}
		placeholder={strings.menu.math.enterExpressionPlaceholder}
		class="edra-math-input"
	></textarea>
</BubbleMenu>

<style>
	.edra-bubble-menu-math {
		background: white;
		border: 1px solid #ccc;
		padding: 0.5rem;
		border-radius: 0.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
	.edra-math-input {
		width: 300px;
		height: 100px;
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 0.25rem;
		font-family: monospace;
		resize: both;
	}
</style>
