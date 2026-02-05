<script lang="ts">
	import { Editor } from '@tiptap/core';
	import strings from '../../../strings.js';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();

	const FONT_SIZE = [
		{ label: strings.toolbar.font.tiny, value: '0.7rem' },
		{ label: strings.toolbar.font.smaller, value: '0.75rem' },
		{ label: strings.toolbar.font.small, value: '0.9rem' },
		{ label: strings.toolbar.font.default, value: '' },
		{ label: strings.toolbar.font.large, value: '1.25rem' },
		{ label: strings.toolbar.font.extraLarge, value: '1.5rem' }
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
	title={strings.toolbar.font.buttonTitle}
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
