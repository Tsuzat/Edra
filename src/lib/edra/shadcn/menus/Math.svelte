<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { type Editor } from '@tiptap/core';
	import BubbleMenu from '../../components/BubbleMenu.svelte';
	import type { ShouldShowProps } from '../../types.js';
	import strings from '../../strings.js';

	interface Props {
		editor: Editor;
		mathPos: number;
		mathLatex: string;
		parentElement?: HTMLElement;
	}

	const { editor, mathPos, mathLatex, parentElement }: Props = $props();

	let latex = $derived(mathLatex);

	function updateLatex() {
		editor.commands.updateBlockMath({
			latex: latex,
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
	options={{
		shift: {
			crossAxis: true
		},
		autoPlacement: {
			allowedPlacements: ['top', 'bottom']
		},
		strategy: 'absolute',
		scrollTarget: parentElement
	}}
	class="bg-popover h-fit w-fit flex-col items-center gap-1 rounded-lg border shadow-lg"
>
	<Textarea
		bind:value={latex}
		oninput={updateLatex}
		placeholder={strings.menu.math.enterExpressionPlaceholder}
		class="h-48 w-96"
	/>
</BubbleMenu>
