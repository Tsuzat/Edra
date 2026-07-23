<script lang="ts">
	import {
		Root,
		Trigger,
		Content,
		Label,
		Item,
		Shortcut
	} from '../../primitives/dropdown/index.ts';
	import AlignLeft from '@lucide/svelte/icons/align-left';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Tooltip from '../Tooltip.svelte';
	import { commands } from '../../../commands/index.js';
	import { getEditor, useEditorTransaction } from '../../../tiptap/index.js';

	const alignments = commands['alignment'];

	const editor = getEditor();
	const transaction = useEditorTransaction(editor);

	const isActive = () => {
		void transaction.version;
		return alignments.find((h) => h.isActive?.(editor)) !== undefined;
	};

	const AlignmentIcon = () => {
		void transaction.version;
		const h = alignments.find((h) => h.isActive?.(editor));
		return h ? h.icon : AlignLeft;
	};
</script>

<Root>
	<Tooltip tooltip="Alignment">
		<Trigger class="edra-btn edra-btn-ghost edra-btn-icon {isActive() ? 'active' : ''}">
			{@const Icon = AlignmentIcon()}
			<Icon />
			<ChevronDown class="chevron-icon" />
		</Trigger>
	</Tooltip>
	<Content>
		<Label>Alignments</Label>
		{#each alignments as alignment (alignment)}
			{@const Icon = alignment.icon}
			<Item onclick={() => alignment.onClick?.(editor)}>
				<Icon class="align-icon" />
				<span>{alignment.tooltip}</span>
				<Shortcut>{alignment.shortCut}</Shortcut>
			</Item>
		{/each}
	</Content>
</Root>

<style>
	:global(.active) {
		background-color: var(--edra-canvas-soft-2) !important;
	}
	:global(.chevron-icon) {
		color: var(--edra-mute);
		width: 0.5rem;
		height: 0.5rem;
	}
	:global(.align-icon) {
		width: 1rem;
		height: 1rem;
	}
</style>
