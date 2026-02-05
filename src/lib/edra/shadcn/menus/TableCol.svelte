<script lang="ts">
	import { Separator } from '$lib/components/ui/separator/index.js';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ArrowLeftFromLine from '@lucide/svelte/icons/arrow-left-from-line';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ArrowRightFromLine from '@lucide/svelte/icons/arrow-right-from-line';
	import Sheet from '@lucide/svelte/icons/sheet';
	import Trash from '@lucide/svelte/icons/trash';
	import { type Editor } from '@tiptap/core';
	import BubbleMenu from '../../components/BubbleMenu.svelte';
	import {
		isColumnGripSelected,
		moveColumnLeft,
		moveColumnRight
	} from '../../extensions/table/utils.js';
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
	pluginKey="table-col-menu"
	shouldShow={(props: ShouldShowProps) => {
		if (!props.editor.isEditable) return false;
		if (!props.state) {
			return false;
		}
		return isColumnGripSelected({ editor, view: props.view, state: props.state, from: props.from });
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
		title={strings.menu.table.headerColumn}
		onclick={() => editor.chain().focus().toggleHeaderColumn().run()}
	>
		<Sheet />
		{strings.menu.table.headerColumn}
	</button>
	<Separator />
	<button
		class="hover:bg-accent hover:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 dark:data-[variant=destructive]:hover:bg-destructive/20 data-[variant=destructive]:hover:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
		title={strings.menu.table.addColumnAfter}
		onclick={() => editor.chain().focus().addColumnAfter().run()}
	>
		<ArrowRightFromLine />
		{strings.menu.table.addColumnAfter}
	</button>
	<button
		class="hover:bg-accent hover:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 dark:data-[variant=destructive]:hover:bg-destructive/20 data-[variant=destructive]:hover:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
		title={strings.menu.table.addColumnBefore}
		onclick={() => editor.chain().focus().addColumnBefore().run()}
	>
		<ArrowLeftFromLine />
		{strings.menu.table.addColumnBefore}
	</button>
	<Separator />
	<button
		class="hover:bg-accent hover:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 dark:data-[variant=destructive]:hover:bg-destructive/20 data-[variant=destructive]:hover:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
		title={strings.menu.table.moveColumnLeft}
		onclick={() => editor.view.dispatch(moveColumnLeft(editor.state.tr))}
	>
		<ArrowLeft />
		{strings.menu.table.moveColumnLeft}
	</button>
	<button
		class="hover:bg-accent hover:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 dark:data-[variant=destructive]:hover:bg-destructive/20 data-[variant=destructive]:hover:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
		title={strings.menu.table.moveColumnRight}
		onclick={() => editor.view.dispatch(moveColumnRight(editor.state.tr))}
	>
		<ArrowRight />
		{strings.menu.table.moveColumnRight}
	</button>
	<Separator />
	<button
		class="hover:bg-accent hover:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 dark:data-[variant=destructive]:hover:bg-destructive/20 data-[variant=destructive]:hover:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
		title={strings.menu.table.deleteColumn}
		data-variant="destructive"
		onclick={() => editor.chain().focus().deleteColumn().run()}
	>
		<Trash />
		{strings.menu.table.deleteColumn}
	</button>
</BubbleMenu>
