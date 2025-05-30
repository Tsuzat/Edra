<script lang="ts">
	import type { Editor } from '@tiptap/core';

	interface Props {
		editor: Editor;
	}
	const { editor }: Props = $props();

	const colors = [
		{ label: 'Default', value: '' },
		{ label: 'Blue', value: '#0000FF' },
		{ label: 'Brown', value: '#A52A2A' },
		{ label: 'Green', value: '#008000' },
		{ label: 'Grey', value: '#808080' },
		{ label: 'Orange', value: '#FFA500' },
		{ label: 'Pink', value: '#FFC0CB' },
		{ label: 'Purple', value: '#800080' },
		{ label: 'Red', value: '#FF0000' },
		{ label: 'Yellow', value: '#FFFF00' }
	];

	const currentColor = $derived.by(() => editor.getAttributes('textStyle').color ?? '');
	const currentHighlight = $derived.by(() => editor.getAttributes('highlight').color ?? '');
</script>

<select
	value={currentColor}
	onchange={(e) => {
		const color = (e.target as HTMLSelectElement).value;
		editor.chain().focus().setColor(color).run();
	}}
	style={`color: ${currentColor}`}
	title="Text Color"
>
	<option value="" label="Default"></option>
	{#each colors as color (color)}
		<option value={color.value} label={color.label}></option>
	{/each}
</select>

<select
	value={currentHighlight}
	onchange={(e) => {
		const color = (e.target as HTMLSelectElement).value;
		editor.chain().focus().setHighlight({ color }).run();
	}}
	style={`background-color: ${currentHighlight}50`}
	title="Hightlight Color"
>
	<option value="" label="Default"></option>
	{#each colors as color (color)}
		<option value={color.value} label={color.label}>A</option>
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
		min-height: var(--edra-button-size);
	}
</style>
