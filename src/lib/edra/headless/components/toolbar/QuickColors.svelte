<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import strings from '../../../strings.js';

	interface Props {
		editor: Editor;
	}
	const { editor }: Props = $props();

	const colors = [
		{ label: strings.toolbar.color.default, value: '' },
		{ label: strings.toolbar.color.blue, value: '#0000FF' },
		{ label: strings.toolbar.color.brown, value: '#A52A2A' },
		{ label: strings.toolbar.color.green, value: '#008000' },
		{ label: strings.toolbar.color.gray, value: '#808080' },
		{ label: strings.toolbar.color.orange, value: '#FFA500' },
		{ label: strings.toolbar.color.pink, value: '#FFC0CB' },
		{ label: strings.toolbar.color.purple, value: '#800080' },
		{ label: strings.toolbar.color.red, value: '#FF0000' },
		{ label: strings.toolbar.color.yellow, value: '#FFFF00' }
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
	title={strings.toolbar.color.textColor}
>
	<option value="" label={strings.toolbar.color.default}></option>
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
	title={strings.toolbar.color.highlightColor}
>
	<option value="" label={strings.toolbar.color.default}></option>
	{#each colors as color (color)}
		<option value={color.value} label={color.label}
			>{strings.toolbar.color.templateCharacter}</option
		>
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
