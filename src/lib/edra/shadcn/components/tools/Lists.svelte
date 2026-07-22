<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { cn } from '$lib/utils.js';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Minus from '@lucide/svelte/icons/minus';
	import { commands } from '$lib/edra/commands/index.js';
	import { getEditor, useEditorTransaction } from '$lib/edra/tiptap/index.js';
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

<DropdownMenu.Root>
	<Tooltip tooltip="Lists">
		{@const Icon = ListIcon()}
		<DropdownMenu.Trigger
			class={buttonVariants({
				variant: 'ghost',
				size: 'icon',
				class: cn(isActive() && 'bg-muted')
			})}
		>
			<Icon />
			<ChevronDown class="size-2! text-muted-foreground" />
		</DropdownMenu.Trigger>
	</Tooltip>
	<DropdownMenu.Content
		class="w-fit"
		portalProps={{ to: editor.view.dom.parentElement ?? undefined }}
	>
		<DropdownMenu.Label>Lists</DropdownMenu.Label>
		{#each lists as list (list)}
			{@const Icon = list.icon}
			<DropdownMenu.Item onclick={() => list.onClick?.(editor)}>
				<Icon />
				{list.tooltip}
				<DropdownMenu.Shortcut>{list.shortCut}</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
