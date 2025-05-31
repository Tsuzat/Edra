<script lang="ts">
	import { Editor } from '@tiptap/core';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();

	const FONT_SIZE = [
		{ label: 'Tiny', value: '0.7rem' },
		{ label: 'Smaller', value: '0.75rem' },
		{ label: 'Small', value: '0.9rem' },
		{ label: 'Default', value: '' },
		{ label: 'Large', value: '1.25rem' },
		{ label: 'Extra Large', value: '1.5rem' }
	];

	let currentSize = $derived.by(() => editor.getAttributes('textStyle').fontSize || '');
</script>

<select
	value={currentSize}
	onchange={(e) => {
		editor
			.chain()
			.focus()
			.setFontSize((e.target as HTMLSelectElement).value)
			.run();
	}}
	title="Font Size"
>
	{#each FONT_SIZE as fontSize (fontSize)}
		<option value={fontSize.value} label={fontSize.label.split(' ')[0]}></option>
	{/each}
</select>

<style>
	select {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: none;
		background-color: var(--edra-button-bg-color);
		border-radius: var(--edra-button-border-radius);
		cursor: pointer;
		transition: background-color 0.2s ease-in-out;
		padding: var(--edra-button-padding);
		min-width: fit;
		min-height: full;
	}
</style>
