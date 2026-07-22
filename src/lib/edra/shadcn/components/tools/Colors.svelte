<script lang="ts">
	import { quickcolors } from '../../../utils.ts';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { cn } from '$lib/utils.js';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Check from '@lucide/svelte/icons/check';
	import Tooltip from '../Tooltip.svelte';
	import { getEditor, useEditorState } from '$lib/edra/tiptap/index.js';

	let open = $state(false);
	const editor = getEditor();
	const editorState = useEditorState({
		editor,
		selector: ({ editor }) => ({
			currentColor: editor.getAttributes('textStyle').color,
			currentHighlight: editor.getAttributes('highlight').color
		})
	});
</script>

<DropdownMenu.Root bind:open>
	<Tooltip tooltip="Quick Colors">
		<DropdownMenu.Trigger
			class={buttonVariants({
				variant: 'ghost',
				size: 'icon',
				class: cn('gap-0.5')
			})}
			style={`color: ${$editorState.currentColor || ''}; background-color: ${$editorState.currentHighlight || ''};`}
		>
			<span>A</span>
			<ChevronDown class="size-2! text-muted-foreground" />
		</DropdownMenu.Trigger>
	</Tooltip>
	<DropdownMenu.Content
		class="max-h-96 min-w-48 overflow-auto rounded-lg duration-300"
		portalProps={{ to: editor.view.dom.parentElement ?? undefined }}
	>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Text Colors</DropdownMenu.Label>
			{#each quickcolors as color (color.label)}
				{@const isActive =
					color.value === ''
						? !$editorState.currentColor
						: $editorState.currentColor === color.value}
				<DropdownMenu.Item
					title={color.label}
					class="flex cursor-pointer items-center justify-between"
					onclick={() => {
						if (color.value === '' || color.label === 'Default') {
							editor.chain().focus().unsetColor().run();
						} else {
							editor.chain().focus().setColor(color.value).run();
						}
					}}
				>
					<div class="flex items-center gap-2">
						<span
							class="w-4 text-center font-bold"
							style={color.value ? `color: ${color.value};` : ''}>A</span
						>
						<span class="capitalize">{color.label}</span>
					</div>
					{#if isActive}
						<Check class="size-4 text-muted-foreground" />
					{/if}
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Label>Background Colors</DropdownMenu.Label>
			{#each quickcolors as color (color.label)}
				{@const isActive =
					color.value === ''
						? !$editorState.currentHighlight
						: $editorState.currentHighlight === `${color.value}50`}
				<DropdownMenu.Item
					title={color.label}
					class="flex cursor-pointer items-center justify-between"
					onclick={() => {
						if (color.value === '' || color.label === 'Default') {
							editor.chain().focus().unsetHighlight().run();
						} else {
							editor
								.chain()
								.focus()
								.setHighlight({ color: `${color.value}50` })
								.run();
						}
					}}
				>
					<div class="flex items-center gap-2">
						<span
							class="size-4 rounded-full border"
							style={`background-color: ${color.value ? `${color.value}50` : 'transparent'};`}
						></span>
						<span class="capitalize">{color.label}</span>
					</div>
					{#if isActive}
						<Check class="size-4 text-muted-foreground" />
					{/if}
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
