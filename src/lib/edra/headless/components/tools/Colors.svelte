<script lang="ts">
	import { quickcolors } from '../../../utils.ts';
	import Popover from '../../primitives/Popover.svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Tooltip from '../Tooltip.svelte';
	import { getEditor, useEditorState } from '../../../tiptap/index.js';

	let open = $state(false);
	const editor = getEditor();
	const editorState = useEditorState({
		editor,
		selector: ({ editor }) => ({
			currentColor: editor.getAttributes('textStyle').color,
			currentHighlight: editor.getAttributes('highlight').color,
			isActive(name: string, opts: Record<string, unknown>) {
				return editor.isActive(name, opts) ?? false;
			}
		})
	});

	const currentColor = $derived($editorState.currentColor);
	const currentHighlight = $derived($editorState.currentHighlight);
</script>

<Popover bind:open>
	{#snippet trigger()}
		<Tooltip tooltip="Quick Colors">
			<button
				class="edra-btn edra-btn-ghost edra-btn-icon colors-trigger"
				style={`color: ${currentColor || 'inherit'}; background-color: ${currentHighlight ? currentHighlight + '75' : 'transparent'};`}
			>
				<span>A</span>
				<ChevronDown class="chevron-icon" />
			</button>
		</Tooltip>
	{/snippet}

	<div class="colors-panel">
		<div class="title">Text Colors</div>
		<div class="colors-grid">
			{#each quickcolors as color (color.label)}
				<button
					class="color-btn"
					style={`color: ${color.value}; background-color: ${color.value}30; border-color: ${$editorState.isActive('textStyle', { color: color.value }) ? 'var(--edra-ink)' : color.value || 'var(--edra-border)'};`}
					title={color.label}
					onclick={() => {
						if (color.value === '' || color.label === 'Default') {
							editor.chain().focus().unsetColor().run();
						} else {
							editor
								.chain()
								.focus()
								.setColor(currentColor === color.value ? '' : color.value)
								.run();
						}
						open = false;
					}}
				>
					A
				</button>
			{/each}
		</div>

		<div class="title margin-top">Background Colors</div>
		<div class="colors-grid">
			{#each quickcolors as color (color.label)}
				<button
					class="color-btn"
					style={`background-color: ${color.value ? color.value + '50' : 'transparent'}; border-color: ${$editorState.isActive('highlight', { color: color.value }) ? 'var(--edra-ink)' : 'var(--edra-border)'};`}
					title={color.label}
					onclick={() => {
						if (color.value === '' || color.label === 'Default') {
							editor.chain().focus().unsetHighlight().run();
						} else {
							editor
								.chain()
								.focus()
								.toggleHighlight({ color: `${color.value}50` })
								.run();
						}
						open = false;
					}}
				>
					A
				</button>
			{/each}
		</div>
	</div>
</Popover>

<style>
	.colors-trigger {
		gap: 2px;
	}
	:global(.chevron-icon) {
		color: var(--edra-mute);
		width: 0.5rem;
		height: 0.5rem;
	}
	.colors-panel {
		padding: 12px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 12rem;
	}
	.title {
		font-size: 0.75rem;
		font-weight: 600;
		margin-bottom: 4px;
		color: var(--edra-mute);
	}
	.title.margin-top {
		margin-top: 8px;
	}
	.colors-grid {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 6px;
	}
	.color-btn {
		width: 1.5rem;
		height: 1.5rem;
		padding: 0;
		border: 1px solid transparent;
		border-radius: var(--edra-radius-sm);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 500;
		transition: all 150ms ease;
		cursor: pointer;
	}
</style>
