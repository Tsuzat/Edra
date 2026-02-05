<script lang="ts">
	import commands from '../../../commands/toolbar-commands.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { cn } from '$lib/utils.js';
	import AlignLeft from '@lucide/svelte/icons/align-left';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import type { Editor } from '@tiptap/core';
	import EdraToolTip from '../EdraToolTip.svelte';
	import strings from '../../../strings.js';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();

	const alignments = commands['alignment'];

	const isActive = $derived.by(() => {
		return alignments.find((h) => h.isActive?.(editor)) !== undefined;
	});

	const AlignmentIcon = $derived.by(() => {
		const h = alignments.find((h) => h.isActive?.(editor));
		return h ? h.icon : AlignLeft;
	});
</script>

<DropdownMenu.Root>
	<EdraToolTip tooltip={strings.toolbar.alignment.buttonTitle}>
		<DropdownMenu.Trigger
			class={buttonVariants({
				variant: 'ghost',
				size: 'icon',
				class: cn('gap-0 p-0', 'border-0 ring-0', isActive && 'bg-muted')
			})}
		>
			<AlignmentIcon class="stroke-primary size-4!" />
			<ChevronDown class="text-muted-foreground size-2!" />
		</DropdownMenu.Trigger>
	</EdraToolTip>
	<DropdownMenu.Content portalProps={{ to: document.getElementById('edra-editor') ?? 'undefined' }}>
		<DropdownMenu.Label>{strings.toolbar.alignment.dropdownTitle}</DropdownMenu.Label>
		{#each alignments as alignment (alignment)}
			{@const Icon = alignment.icon}
			<DropdownMenu.Item onclick={() => alignment.onClick?.(editor)}>
				<Icon />
				{alignment.tooltip}
				<DropdownMenu.Shortcut>
					{alignment.shortCut}
				</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
