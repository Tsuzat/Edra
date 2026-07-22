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
	pluginKey="math-inline-bubble-menu"
	shouldShow={(props) => {
		const { editor: propsEditor, state } = props;
		if (!propsEditor || !propsEditor.isEditable) return false;
		if (!state) return false;
		return propsEditor.isActive('inlineMath');
	}}
	options={{
		shift: true,
		autoPlacement: {
			allowedPlacements: ['top', 'bottom']
		},
		strategy: 'absolute',
		scrollTarget: editor.view.dom.parentElement ?? window
	}}
	class="flex h-fit w-fit items-center gap-1 rounded-lg border bg-popover shadow-lg"
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
