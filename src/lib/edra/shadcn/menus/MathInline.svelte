<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import CornerDownLeft from '@lucide/svelte/icons/corner-down-left';
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
		editor.chain().setNodeSelection(mathPos).updateInlineMath({ latex }).focus().run();
	}
</script>

<BubbleMenu
	{editor}
	pluginKey="math-bubble-menu"
	shouldShow={(props: ShouldShowProps) => {
		if (!props.editor.isEditable) return false;
		if (!props.state) return false;
		return editor.isActive('inlineMath');
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
	class="bg-popover flex h-fit w-fit items-center gap-1 rounded-lg border shadow-lg"
>
	<Input
		bind:value={latex}
		onchange={updateLatex}
		placeholder={strings.menu.math.enterExpressionPlaceholder}
		class="w-56"
	/>
	<Button variant="default" size="icon" onclick={updateLatex}>
		<CornerDownLeft />
	</Button>
</BubbleMenu>
