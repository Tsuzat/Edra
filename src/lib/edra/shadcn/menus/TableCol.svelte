<script lang="ts">
	import type { ShouldShowProps } from '../../types.js';
	import { type Editor } from '@tiptap/core';
	import { BubbleMenu } from 'svelte-tiptap';
	import ArrowLeftFromLine from '@lucide/svelte/icons/arrow-left-from-line';
	import ArrowRightFromLine from '@lucide/svelte/icons/arrow-right-from-line';

	import Trash from '@lucide/svelte/icons/trash';
	import Button from '$lib/components/ui/button/button.svelte';
	import { isColumnGripSelected } from '../../extensions/table/utils.js';
	import EdraToolTip from '../components/EdraToolTip.svelte';
	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();
</script>

<BubbleMenu
	{editor}
	pluginKey="table-col-menu"
	shouldShow={(props: ShouldShowProps) => {
		if (!props.editor.isEditable) return false;
		if (!props.state) {
			return false;
		}
		return isColumnGripSelected({
			editor: props.editor,
			view: props.view,
			state: props.state,
			from: props.from
		});
	}}
	tippyOptions={{
		placement: 'top-start'
	}}
	class="bg-background flex h-fit w-fit items-center gap-1 rounded border p-1 shadow-lg"
>
	<EdraToolTip tooltip="Add Column After">
		<Button
			variant="ghost"
			size="icon"
			onclick={() => editor.chain().focus().addColumnAfter().run()}
		>
			<ArrowRightFromLine />
		</Button>
	</EdraToolTip>
	<EdraToolTip tooltip="Add Column Before">
		<Button
			variant="ghost"
			size="icon"
			onclick={() => editor.chain().focus().addColumnBefore().run()}
		>
			<ArrowLeftFromLine />
		</Button>
	</EdraToolTip>

	<EdraToolTip tooltip="Delete This Column">
		<Button variant="ghost" size="icon" onclick={() => editor.chain().focus().deleteColumn().run()}>
			<Trash />
		</Button>
	</EdraToolTip>
</BubbleMenu>
