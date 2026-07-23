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
	import Minus from '@lucide/svelte/icons/minus';
	import { commands } from '../../../commands/index.js';
	import { getEditor, useEditorTransaction } from '../../../tiptap/index.js';
	import Tooltip from '../Tooltip.svelte';

	const lists = commands['lists'];

	const editor = getEditor();
	const transaction = useEditorTransaction(editor);
	const isActive = () => {
		void transaction.version;
		return lists.some((h) => h.isActive?.(editor));
	};

	const ListIcon = () => {
		void transaction.version;
		const h = lists.find((h) => h.isActive?.(editor));
		return h ? h.icon : Minus;
	};
</script>

<Root>
	<Tooltip tooltip="Lists">
		{@const Icon = ListIcon()}
		<Trigger class="edra-btn edra-btn-ghost edra-btn-icon {isActive() ? 'active' : ''}">
			<Icon />
			<ChevronDown class="chevron-icon" />
		</Trigger>
	</Tooltip>
	<Content>
		<Label>Lists</Label>
		{#each lists as list (list)}
			{@const Icon = list.icon}
			<Item onclick={() => list.onClick?.(editor)}>
				<Icon class="list-icon" />
				<span>{list.tooltip}</span>
				<Shortcut>{list.shortCut}</Shortcut>
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
	:global(.list-icon) {
		width: 1rem;
		height: 1rem;
	}
</style>
