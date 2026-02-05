<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { cn } from '$lib/utils.js';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { Editor } from '@tiptap/core';
	import EdraToolTip from '../EdraToolTip.svelte';
	import strings from '../../../strings.js';

	interface Props {
		class?: string;
		editor: Editor;
	}

	const { class: className = '', editor }: Props = $props();

	const FONT_SIZE = [
		{ label: strings.toolbar.font.tiny, value: '0.7rem' },
		{ label: strings.toolbar.font.smaller, value: '0.75rem' },
		{ label: strings.toolbar.font.small, value: '0.9rem' },
		{ label: strings.toolbar.font.default, value: '' },
		{ label: strings.toolbar.font.large, value: '1.25rem' },
		{ label: strings.toolbar.font.extraLarge, value: '1.5rem' }
	];

	let currentSize = $derived.by(() => editor.getAttributes('textStyle').fontSize || '');

	const currentLabel = $derived.by(() => {
		const l = FONT_SIZE.find((f) => f.value === currentSize);
		if (l) return l.label.split(' ')[0];
		return 'Medium';
	});
</script>

<DropdownMenu.Root>
	<EdraToolTip tooltip={strings.toolbar.font.buttonTitle}>
		<DropdownMenu.Trigger
			class={buttonVariants({
				variant: 'ghost',
				size: 'sm',
				class: cn(
					'gap-0 p-0',
					'text-primary! hover:bg-accent dark:hover:bg-accent/50! border-0 bg-transparent! ring-0 [&_svg]:size-2',
					className
				)
			})}
		>
			<span>{currentLabel}</span>
			<ChevronDown class="text-muted-foreground size-2!" />
		</DropdownMenu.Trigger>
	</EdraToolTip>
	<DropdownMenu.Content portalProps={{ to: document.getElementById('edra-editor') ?? 'undefined' }}>
		<DropdownMenu.Label>{strings.toolbar.font.dropdownTitle}</DropdownMenu.Label>
		{#each FONT_SIZE as fontSize (fontSize)}
			<DropdownMenu.Item
				onclick={() => {
					editor.chain().focus().setFontSize(fontSize.value).run();
				}}
				>{fontSize.label}
				<DropdownMenu.Shortcut>
					{fontSize.value}
				</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
