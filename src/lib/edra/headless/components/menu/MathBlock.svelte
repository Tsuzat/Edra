<script lang="ts">
	import { BubbleMenu, getEditor, useEditorState } from '../../../tiptap/index.js';
	import strings from '../../../strings.js';

	const editor = getEditor();
	const editorState = useEditorState({
		editor,
		selector: ({ editor }) => ({
			latex: editor.getAttributes('blockMath').latex as string
		})
	});
	let latex = $derived($editorState.latex);

	function updateLatex() {
		editor.commands.updateBlockMath({ latex });
	}
</script>

<BubbleMenu
	{editor}
	pluginKey="math-block-bubble-menu"
	shouldShow={(props) => {
		const { editor: propsEditor, state } = props;
		if (!propsEditor || !propsEditor.isEditable) return false;
		if (!state) return false;
		return propsEditor.isActive('blockMath');
	}}
	options={{
		shift: true,
		autoPlacement: {
			allowedPlacements: ['top', 'bottom']
		},
		strategy: 'absolute',
		scrollTarget: editor.view.dom.parentElement ?? window
	}}
	class="math-menu"
>
	<textarea
		bind:value={latex}
		oninput={updateLatex}
		placeholder={strings.menu.math.enterExpressionPlaceholder}
		class="edra-textarea math-textarea"></textarea>
</BubbleMenu>

<style>
	:global(.math-menu) {
		display: flex;
		height: fit-content;
		width: fit-content;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		border-radius: var(--edra-radius-lg);
		border: 1px solid var(--edra-border);
		padding: 6px;
		background-color: var(--edra-canvas);
		box-shadow: var(--edra-shadow-5);
	}
	.math-textarea {
		height: 12rem;
		width: 24rem;
		font-family: var(--edra-font-mono);
		font-size: 0.875rem;
		line-height: 1.625;
	}
</style>
