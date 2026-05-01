<script lang="ts">
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
	import EdraToolTip from '../components/EdraToolTip.svelte';

	interface Props {
		editor: Editor;
		parentElement?: HTMLElement;
	}

	const { editor, parentElement }: Props = $props();

	const btnClass =
		'hover:bg-accent hover:text-accent-foreground text-muted-foreground flex size-8 cursor-default items-center justify-center rounded-sm outline-hidden [&_svg]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0';
	const destructiveBtnClass =
		'hover:bg-destructive/10 dark:hover:bg-destructive/20 text-destructive flex size-8 cursor-default items-center justify-center rounded-sm outline-hidden [&_svg]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0';
</script>

<BubbleMenu
	{editor}
	pluginKey="table-row-menu"
	shouldShow={(props: ShouldShowProps) => {
		if (!props.editor.isEditable) return false;
		if (!props.state) return false;
		return isRowGripSelected({ editor, view: props.view, state: props.state, from: props.from });
	}}
	options={{
		shift: { crossAxis: true, mainAxis: true },
		strategy: 'absolute',
		autoPlacement: { allowedPlacements: ['bottom', 'top'] },
		scrollTarget: parentElement
	}}
	class="bg-popover! z-50 flex h-fit w-fit items-center gap-0.5 rounded-lg border p-1"
>
	<EdraToolTip tooltip={strings.menu.table.headerRow}>
		<button class={btnClass} onclick={() => editor.chain().focus().toggleHeaderRow().run()}>
			<Sheet />
		</button>
	</EdraToolTip>
	<div class="bg-border mx-0.5 h-5 w-px"></div>
	<EdraToolTip tooltip={strings.menu.table.addRowBefore}>
		<button class={btnClass} onclick={() => editor.chain().focus().addRowBefore().run()}>
			<ArrowUpFromLine />
		</button>
	</EdraToolTip>
	<EdraToolTip tooltip={strings.menu.table.addRowAfter}>
		<button class={btnClass} onclick={() => editor.chain().focus().addRowAfter().run()}>
			<ArrowDownFromLine />
		</button>
	</EdraToolTip>
	<div class="bg-border mx-0.5 h-5 w-px"></div>
	<EdraToolTip tooltip={strings.menu.table.moveRowUp}>
		<button class={btnClass} onclick={() => editor.view.dispatch(moveRowUp(editor.state.tr))}>
			<ArrowUp />
		</button>
	</EdraToolTip>
	<EdraToolTip tooltip={strings.menu.table.moveRowDown}>
		<button class={btnClass} onclick={() => editor.view.dispatch(moveRowDown(editor.state.tr))}>
			<ArrowDown />
		</button>
	</EdraToolTip>
	<div class="bg-border mx-0.5 h-5 w-px"></div>
	<EdraToolTip tooltip={strings.menu.table.deleteRow}>
		<button class={destructiveBtnClass} onclick={() => editor.chain().focus().deleteRow().run()}>
			<Trash />
		</button>
	</EdraToolTip>
</BubbleMenu>
