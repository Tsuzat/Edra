<script lang="ts">
	import { Separator } from '$lib/components/ui/separator/index.js';
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import ArrowDownFromLine from '@lucide/svelte/icons/arrow-down-from-line';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import ArrowUpFromLine from '@lucide/svelte/icons/arrow-up-from-line';
	import Sheet from '@lucide/svelte/icons/sheet';
	import Trash from '@lucide/svelte/icons/trash';
	import { type Editor } from '@tiptap/core';
	import BubbleMenu from '../../components/BubbleMenu.svelte';
	import { isRowGripSelected, moveRowDown, moveRowUp } from '../../extensions/table/utils.js';
	import type { ShouldShowProps } from '../../types.js';
	import strings from '../../strings.js';

	interface Props {
		editor: Editor;
		parentElement?: HTMLElement;
	}

	const { editor, parentElement }: Props = $props();
</script>

<BubbleMenu
	{editor}
	pluginKey="table-row-menu"
	shouldShow={(props: ShouldShowProps) => {
		if (!props.editor.isEditable) return false;
		if (!props.state) {
			return false;
		}
		return isRowGripSelected({ editor, view: props.view, state: props.state, from: props.from });
	}}
	options={{
		shift: {
			crossAxis: true,
			mainAxis: true
		},
		strategy: 'absolute',
		autoPlacement: {
			allowedPlacements: ['bottom', 'top']
		},
		scrollTarget: parentElement
	}}
	class="bg-popover! z-50 flex h-fit w-fit flex-col gap-1 rounded-lg border"
>
	<button
		class="hover:bg-accent hover:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 dark:data-[variant=destructive]:hover:bg-destructive/20 data-[variant=destructive]:hover:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
		title={strings.menu.table.headerRow}
		onclick={() => editor.chain().focus().toggleHeaderRow().run()}
	>
		<Sheet />
		{strings.menu.table.headerRow}
	</button>
	<Separator />
	<button
		class="hover:bg-accent hover:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 dark:data-[variant=destructive]:hover:bg-destructive/20 data-[variant=destructive]:hover:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
		title={strings.menu.table.addRowAfter}
		onclick={() => editor.chain().focus().addRowAfter().run()}
	>
		<ArrowDownFromLine />
		{strings.menu.table.addRowAfter}
	</button>
	<button
		class="hover:bg-accent hover:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 dark:data-[variant=destructive]:hover:bg-destructive/20 data-[variant=destructive]:hover:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
		title={strings.menu.table.addRowBefore}
		onclick={() => editor.chain().focus().addRowBefore().run()}
	>
		<ArrowUpFromLine />
		{strings.menu.table.addRowBefore}
	</button>
	<Separator />
	<button
		class="hover:bg-accent hover:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 dark:data-[variant=destructive]:hover:bg-destructive/20 data-[variant=destructive]:hover:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
		title={strings.menu.table.moveRowUp}
		onclick={() => editor.view.dispatch(moveRowUp(editor.state.tr))}
	>
		<ArrowUp />
		{strings.menu.table.moveRowUp}
	</button>
	<button
		class="hover:bg-accent hover:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 dark:data-[variant=destructive]:hover:bg-destructive/20 data-[variant=destructive]:hover:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
		title={strings.menu.table.moveRowDown}
		onclick={() => editor.view.dispatch(moveRowDown(editor.state.tr))}
	>
		<ArrowDown />
		{strings.menu.table.moveRowDown}
	</button>
	<Separator />
	<button
		class="hover:bg-accent hover:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 dark:data-[variant=destructive]:hover:bg-destructive/20 data-[variant=destructive]:hover:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
		title={strings.menu.table.deleteRow}
		data-variant="destructive"
		onclick={() => editor.chain().focus().deleteRow().run()}
	>
		<Trash />
		{strings.menu.table.deleteRow}
	</button>
</BubbleMenu>
