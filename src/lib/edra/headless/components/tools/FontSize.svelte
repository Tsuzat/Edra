<script lang="ts">
	import {
		Root,
		Trigger,
		Content,
		Label,
		Item,
		Shortcut
	} from '../../primitives/dropdown/index.ts';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Tooltip from '../Tooltip.svelte';
	import { getEditor, useEditorTransaction } from '$lib/edra/tiptap/index.js';

	const editor = getEditor();
	const transaction = useEditorTransaction(editor);

	const currentSize = () => {
		void transaction.version;
		return editor.getAttributes('textStyle').fontSize || '';
	};

	const FONT_SIZE = [
		{ label: 'Tiny', value: '0.7rem' },
		{ label: 'Smaller', value: '0.75rem' },
		{ label: 'Small', value: '0.9rem' },
		{ label: 'Default', value: '' },
		{ label: 'Large', value: '1.25rem' },
		{ label: 'Extra Large', value: '1.5rem' }
	];

	const currentLabel = $derived.by(() => {
		const l = FONT_SIZE.find((f) => f.value === currentSize());
		if (l) return l.label.split(' ')[0];
		return 'Medium';
	});
</script>

<Root>
	<Tooltip tooltip="Font Size">
		<Trigger class="edra-btn edra-btn-ghost trigger-font-btn">
			<span>{currentLabel}</span>
			<ChevronDown class="chevron-icon" />
		</Trigger>
	</Tooltip>

	<style>
		.trigger-font-btn {
			font-weight: 500;
		}
		:global(.chevron-icon) {
			color: var(--edra-mute);
			width: 0.5rem;
			height: 0.5rem;
		}
	</style>
	<Content>
		<Label>Font Size</Label>
		{#each FONT_SIZE as fontSize (fontSize)}
			<Item
				onclick={() => {
					editor.chain().focus().setFontSize(fontSize.value).run();
				}}
			>
				<span>{fontSize.label}</span>
				<Shortcut>{fontSize.value || 'default'}</Shortcut>
			</Item>
		{/each}
	</Content>
</Root>
