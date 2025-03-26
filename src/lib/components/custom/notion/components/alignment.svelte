<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { commands } from '$lib/edra/commands/commands.js';
	import type { Editor } from '@tiptap/core';
	import { icons } from 'lucide-svelte';
	import AlignCenter from 'lucide-svelte/icons/align-center';
	import AlignLeft from 'lucide-svelte/icons/align-left';
	import AlignRight from 'lucide-svelte/icons/align-right';
	import AlignJustify from 'lucide-svelte/icons/align-justify';
	import Check from 'lucide-svelte/icons/check';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import EdraToolTip from '$lib/edra/shadcn/components/EdraToolTip.svelte';

	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();

	const alignMent = $derived.by(() => {
		if (editor.isActive({ textAlign: 'left' })) return 'left';
		else if (editor.isActive({ textAlign: 'center' })) return 'center';
		else if (editor.isActive({ textAlign: 'right' })) return 'right';
		else if (editor.isActive({ textAlign: 'justify' })) return 'justify';
		else return 'left';
	});
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<EdraToolTip content="Alignment">
			<Button variant="ghost" class="h-8 w-fit gap-0.5 p-2">
				{#if alignMent === 'left'}
					<AlignLeft />
				{:else if alignMent === 'center'}
					<AlignCenter />
				{:else if alignMent === 'right'}
					<AlignRight />
				{:else if alignMent === 'justify'}
					<AlignJustify />
				{:else}
					<AlignLeft />
				{/if}
				<ChevronDown class="!size-2 text-muted-foreground" />
			</Button>
		</EdraToolTip>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content
		class="h-fit w-40 gap-1 rounded-md bg-popover p-0.5"
		portalProps={{ to: undefined, disabled: true }}
	>
		{#each commands['alignment'].commands as command}
			<DropdownMenu.Item onclick={() => command.action(editor)}>
				{@const Icon = icons[command.iconName]}
				<Icon />
				<span>{command.label}</span>
				{#if command.name.toLowerCase().includes(alignMent)}
					<Check class="ml-auto !size-3" />
				{/if}
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
