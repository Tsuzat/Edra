<script lang="ts">
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
		shift: {
			crossAxis: true
		},
		autoPlacement: {
			allowedPlacements: ['top', 'bottom']
		},
		strategy: 'fixed',
		scrollTarget: editor.view.dom.parentElement ?? window
	}}
	class="math-inline-menu"
>
	<input
		bind:value={latex}
		onchange={updateLatex}
		placeholder={strings.menu.math.enterExpressionPlaceholder}
		class="edra-input math-inline-input"
	/>
	<button class="edra-btn edra-btn-primary edra-btn-icon save-btn" onclick={updateLatex}>
		<CornerDownLeft class="action-icon" />
	</button>
</BubbleMenu>

<style>
	:global(.math-inline-menu) {
		display: flex;
		height: fit-content;
		width: fit-content;
		align-items: center;
		gap: 6px;
		border-radius: var(--edra-radius-lg);
		border: 1px solid var(--edra-border);
		padding: 6px;
		background-color: var(--edra-canvas);
		box-shadow: var(--edra-shadow-5);
	}
	.math-inline-input {
		width: 16rem;
	}
	.save-btn {
		width: 2.25rem;
		height: 2.25rem;
		flex-shrink: 0;
	}
	:global(.action-icon) {
		width: 1rem;
		height: 1rem;
	}
</style>
