<script lang="ts">
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
	pluginKey="table-col-menu"
	shouldShow={(props: ShouldShowProps) => {
		if (!props.editor.isEditable) return false;
		if (!props.state) return false;
		return isColumnGripSelected({ editor, view: props.view, state: props.state, from: props.from });
	}}
	options={{
		shift: { crossAxis: true, mainAxis: true },
		strategy: 'absolute',
		autoPlacement: { allowedPlacements: ['bottom', 'top'] },
		scrollTarget: parentElement
	}}
	class="bg-popover! z-50 flex h-fit w-fit items-center gap-0.5 rounded-lg border p-1"
>
	<EdraToolTip tooltip={strings.menu.table.headerColumn}>
		<button class={btnClass} onclick={() => editor.chain().focus().toggleHeaderColumn().run()}>
			<Sheet />
		</button>
	</EdraToolTip>
	<div class="bg-border mx-0.5 h-5 w-px"></div>
	<EdraToolTip tooltip={strings.menu.table.addColumnBefore}>
		<button class={btnClass} onclick={() => editor.chain().focus().addColumnBefore().run()}>
			<ArrowLeftFromLine />
		</button>
	</EdraToolTip>
	<EdraToolTip tooltip={strings.menu.table.addColumnAfter}>
		<button class={btnClass} onclick={() => editor.chain().focus().addColumnAfter().run()}>
			<ArrowRightFromLine />
		</button>
	</EdraToolTip>
	<div class="bg-border mx-0.5 h-5 w-px"></div>
	<EdraToolTip tooltip={strings.menu.table.moveColumnLeft}>
		<button class={btnClass} onclick={() => editor.view.dispatch(moveColumnLeft(editor.state.tr))}>
			<ArrowLeft />
		</button>
	</EdraToolTip>
	<EdraToolTip tooltip={strings.menu.table.moveColumnRight}>
		<button class={btnClass} onclick={() => editor.view.dispatch(moveColumnRight(editor.state.tr))}>
			<ArrowRight />
		</button>
	</EdraToolTip>
	<div class="bg-border mx-0.5 h-5 w-px"></div>
	<EdraToolTip tooltip={strings.menu.table.deleteColumn}>
		<button class={destructiveBtnClass} onclick={() => editor.chain().focus().deleteColumn().run()}>
			<Trash />
		</button>
	</EdraToolTip>
</BubbleMenu>
