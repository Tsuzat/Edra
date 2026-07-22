<script lang="ts">
	import { Separator } from '$lib/components/ui/separator/index.js';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ArrowLeftFromLine from '@lucide/svelte/icons/arrow-left-from-line';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ArrowRightFromLine from '@lucide/svelte/icons/arrow-right-from-line';
	import Sheet from '@lucide/svelte/icons/sheet';
	import Trash from '@lucide/svelte/icons/trash';
	import {
		isColumnGripSelected,
		moveColumnLeft,
		moveColumnRight
	} from '../../../tiptap/extensions/table/index.js';
	import { BubbleMenu, getEditor } from '$lib/edra/tiptap/index.js';
	import strings from '../../../strings.js';
	const editor = getEditor();
</script>

<BubbleMenu
	{editor}
	pluginKey="table-col-menu"
	shouldShow={(props) => {
		const { editor: propsEditor, state, view, from } = props;
		if (!propsEditor || !propsEditor.isEditable) return false;
		if (!state) return false;
		return isColumnGripSelected({ editor: propsEditor, view, state, from });
	}}
	options={{
		shift: true,
		autoPlacement: {
			allowedPlacements: ['top', 'bottom']
		},
		strategy: 'absolute',
		scrollTarget: editor.view.dom.parentElement ?? window
	}}
	class="z-50 flex h-fit w-fit flex-col gap-1 rounded-lg border bg-popover! p-2"
>
	<button
		class="relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground data-inset:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 data-[variant=destructive]:hover:text-destructive dark:data-[variant=destructive]:hover:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!"
		title={strings.menu.table.headerColumn}
		onclick={() => editor.chain().focus().toggleHeaderColumn().run()}
	>
		<Sheet />
		{strings.menu.table.headerColumn}
	</button>
	<Separator />
	<button
		class="relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground data-inset:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 data-[variant=destructive]:hover:text-destructive dark:data-[variant=destructive]:hover:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!"
		title={strings.menu.table.addColumnAfter}
		onclick={() => editor.chain().focus().addColumnAfter().run()}
	>
		<ArrowRightFromLine />
		{strings.menu.table.addColumnAfter}
	</button>
	<button
		class="relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground data-inset:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 data-[variant=destructive]:hover:text-destructive dark:data-[variant=destructive]:hover:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!"
		title={strings.menu.table.addColumnBefore}
		onclick={() => editor.chain().focus().addColumnBefore().run()}
	>
		<ArrowLeftFromLine />
		{strings.menu.table.addColumnBefore}
	</button>
	<Separator />
	<button
		class="relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground data-inset:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 data-[variant=destructive]:hover:text-destructive dark:data-[variant=destructive]:hover:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!"
		title={strings.menu.table.moveColumnLeft}
		onclick={() => editor.view.dispatch(moveColumnLeft(editor.state.tr))}
	>
		<ArrowLeft />
		{strings.menu.table.moveColumnLeft}
	</button>
	<button
		class="relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground data-inset:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 data-[variant=destructive]:hover:text-destructive dark:data-[variant=destructive]:hover:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!"
		title={strings.menu.table.moveColumnRight}
		onclick={() => editor.view.dispatch(moveColumnRight(editor.state.tr))}
	>
		<ArrowRight />
		{strings.menu.table.moveColumnRight}
	</button>
	<Separator />
	<button
		class="relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground data-inset:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 data-[variant=destructive]:hover:text-destructive dark:data-[variant=destructive]:hover:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!"
		title={strings.menu.table.deleteColumn}
		data-variant="destructive"
		onclick={() => editor.chain().focus().deleteColumn().run()}
	>
		<Trash />
		{strings.menu.table.deleteColumn}
	</button>
</BubbleMenu>
