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
import { isColumnGripSelected, moveColumnLeft, moveColumnRight } from '../../extensions/table/utils.js';
import type { ShouldShowProps } from '../../types.js';

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
		title="Add Column After"
		onclick={() => editor.chain().focus().toggleHeaderColumn().run()}
	>
		<Sheet />
		Header Column
	</button>
	<Separator />
	<button
		class="hover:bg-accent hover:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 dark:data-[variant=destructive]:hover:bg-destructive/20 data-[variant=destructive]:hover:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
		title="Add Column After"
		onclick={() => editor.chain().focus().addColumnAfter().run()}
	>
		<ArrowRightFromLine />
		Add Column After
	</button>
	<button
		class="hover:bg-accent hover:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 dark:data-[variant=destructive]:hover:bg-destructive/20 data-[variant=destructive]:hover:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
		title="Add Column Before"
		onclick={() => editor.chain().focus().addColumnBefore().run()}
	>
		<ArrowLeftFromLine />
		Add Column Before
	</button>
	<Separator />
	<button
		class="hover:bg-accent hover:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 dark:data-[variant=destructive]:hover:bg-destructive/20 data-[variant=destructive]:hover:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
		title="Move Column Left"
		onclick={() => editor.view.dispatch(moveColumnLeft(editor.state.tr))}
	>
		<ArrowLeft />
		Move Column Left
	</button>
	<button
		class="hover:bg-accent hover:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 dark:data-[variant=destructive]:hover:bg-destructive/20 data-[variant=destructive]:hover:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
		title="Move Column Right"
		onclick={() => editor.view.dispatch(moveColumnRight(editor.state.tr))}
	>
		<ArrowRight />
		Move Column Right
	</button>
	<Separator />
	<button
		class="hover:bg-accent hover:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 dark:data-[variant=destructive]:hover:bg-destructive/20 data-[variant=destructive]:hover:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
		title="Delete This Column"
		data-variant="destructive"
		onclick={() => editor.chain().focus().deleteColumn().run()}
	>
		<Trash />
		Delete This Column
	</button>
</BubbleMenu>
