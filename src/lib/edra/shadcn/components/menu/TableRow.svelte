<script lang="ts">
	import { Separator } from '$lib/components/ui/separator/index.js';
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import ArrowDownFromLine from '@lucide/svelte/icons/arrow-down-from-line';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import ArrowUpFromLine from '@lucide/svelte/icons/arrow-up-from-line';
	import Sheet from '@lucide/svelte/icons/sheet';
	import Trash from '@lucide/svelte/icons/trash';
	import {
		isRowGripSelected,
		moveRowDown,
		moveRowUp
	} from '../../../tiptap/extensions/table/utils.js';
	import { BubbleMenu, getEditor } from '$lib/edra/tiptap/index.js';
	import strings from '../../../strings.js';

	const editor = getEditor();
</script>

<BubbleMenu
	{editor}
	pluginKey="table-row-menu"
	shouldShow={(props) => {
		const { editor: propsEditor, state, view, from } = props;
		if (!propsEditor || !propsEditor.isEditable) return false;
		if (!state) return false;
		return isRowGripSelected({ editor: propsEditor, view, state, from });
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
		title={strings.menu.table.headerRow}
		onclick={() => editor.chain().focus().toggleHeaderRow().run()}
	>
		<Sheet />
		{strings.menu.table.headerRow}
	</button>
	<Separator />
	<button
		class="relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground data-inset:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 data-[variant=destructive]:hover:text-destructive dark:data-[variant=destructive]:hover:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!"
		title={strings.menu.table.addRowAfter}
		onclick={() => editor.chain().focus().addRowAfter().run()}
	>
		<ArrowDownFromLine />
		{strings.menu.table.addRowAfter}
	</button>
	<button
		class="relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground data-inset:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 data-[variant=destructive]:hover:text-destructive dark:data-[variant=destructive]:hover:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!"
		title={strings.menu.table.addRowBefore}
		onclick={() => editor.chain().focus().addRowBefore().run()}
	>
		<ArrowUpFromLine />
		{strings.menu.table.addRowBefore}
	</button>
	<Separator />
	<button
		class="relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground data-inset:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 data-[variant=destructive]:hover:text-destructive dark:data-[variant=destructive]:hover:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!"
		title={strings.menu.table.moveRowUp}
		onclick={() => editor.view.dispatch(moveRowUp(editor.state.tr))}
	>
		<ArrowUp />
		{strings.menu.table.moveRowUp}
	</button>
	<button
		class="relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground data-inset:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 data-[variant=destructive]:hover:text-destructive dark:data-[variant=destructive]:hover:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!"
		title={strings.menu.table.moveRowDown}
		onclick={() => editor.view.dispatch(moveRowDown(editor.state.tr))}
	>
		<ArrowDown />
		{strings.menu.table.moveRowDown}
	</button>
	<Separator />
	<button
		class="relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground data-inset:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 data-[variant=destructive]:hover:text-destructive dark:data-[variant=destructive]:hover:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!"
		title={strings.menu.table.deleteRow}
		data-variant="destructive"
		onclick={() => editor.chain().focus().deleteRow().run()}
	>
		<Trash />
		{strings.menu.table.deleteRow}
	</button>
</BubbleMenu>
