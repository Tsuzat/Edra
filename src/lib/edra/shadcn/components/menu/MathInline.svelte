<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import strings from '../../../strings.js';
	import { BubbleMenu, getEditor, useEditorState } from '$lib/edra/tiptap/index.js';
	import CornerDownLeft from '@lucide/svelte/icons/corner-down-left';

	const editor = getEditor();
	const editorState = useEditorState({
		editor,
		selector: ({ editor }) => ({
			latex: editor.getAttributes('inlineMath').latex as string
		})
	});
	let latex = $derived($editorState.latex);

	function updateLatex() {
		editor.commands.updateInlineMath({ latex });
	}
</script>

<BubbleMenu
	{editor}
	pluginKey="math-bubble-menu"
	shouldShow={(props) => {
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
		strategy: 'fixed',
		scrollTarget: editor.view.dom.parentElement ?? window
	}}
	class="bg-popover flex h-fit w-fit items-center gap-1 rounded-lg border shadow-lg"
>
	<Input
		bind:value={latex}
		onchange={updateLatex}
		placeholder={strings.menu.math.enterExpressionPlaceholder}
		class="w-64"
	/>
	<Button variant="default" size="icon" onclick={updateLatex}>
		<CornerDownLeft />
	</Button>
</BubbleMenu>
