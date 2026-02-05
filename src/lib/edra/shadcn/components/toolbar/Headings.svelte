<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { cn } from '$lib/utils.js';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Paragraph from '@lucide/svelte/icons/pilcrow';
	import type { Editor } from '@tiptap/core';
	import commands from '../../../commands/toolbar-commands.js';
	import EdraToolTip from '../EdraToolTip.svelte';
	import strings from '../../../strings.js';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();

	const headings = commands['headings'];

	const isActive = $derived.by(() => {
		return headings.find((h) => h.isActive?.(editor)) !== undefined;
	});

	const HeadingIcon = $derived.by(() => {
		const h = headings.find((h) => h.isActive?.(editor));
		return h ? h.icon : Paragraph;
	});
</script>

<DropdownMenu.Root>
	<EdraToolTip tooltip={strings.toolbar.heading.buttonTitle}>
		<DropdownMenu.Trigger
			class={buttonVariants({
				variant: 'ghost',
				size: 'icon',
				class: cn('gap-0 p-0', 'border-0 ring-0', isActive && 'bg-muted')
			})}
		>
			<HeadingIcon class="stroke-primary size-4!" />
			<ChevronDown class="text-muted-foreground size-2!" />
		</DropdownMenu.Trigger>
	</EdraToolTip>
	<DropdownMenu.Content portalProps={{ to: document.getElementById('edra-editor') ?? 'undefined' }}>
		<DropdownMenu.Item onclick={() => editor.chain().focus().setParagraph().run()}>
			<Paragraph />
			<span>{strings.command.paragraph}</span>
		</DropdownMenu.Item>
		{#each headings as heading (heading)}
			{@const Icon = heading.icon}
			<DropdownMenu.Item onclick={() => heading.onClick?.(editor)}>
				<Icon />
				{heading.tooltip}
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
