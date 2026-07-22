<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
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

<DropdownMenu.Root>
	<Tooltip tooltip="Font Size">
		<DropdownMenu.Trigger
			class={buttonVariants({
				variant: 'ghost'
			})}
		>
			<span>{currentLabel}</span>
			<ChevronDown class="size-2! text-muted-foreground" />
		</DropdownMenu.Trigger>
	</Tooltip>
	<DropdownMenu.Content
		class="w-fit"
		portalProps={{ to: editor.view.dom.parentElement ?? undefined }}
	>
		<DropdownMenu.Label>Font Size</DropdownMenu.Label>
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
