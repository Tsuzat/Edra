<script lang="ts">
	import type { ShouldShowProps } from '../../types.js';
	import { type Editor } from '@tiptap/core';
	import { BubbleMenu } from 'svelte-tiptap';
	import ArrowDownFromLine from '@lucide/svelte/icons/arrow-down-from-line';
	import ArrowUpFromLine from '@lucide/svelte/icons/arrow-up-from-line';
	import Trash from '@lucide/svelte/icons/trash';
	import Button from '$lib/components/ui/button/button.svelte';
	import { isRowGripSelected } from '../../extensions/table/utils.js';
	import EdraToolTip from '../components/EdraToolTip.svelte';
	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();
</script>

<BubbleMenu
	{editor}
	pluginKey="table-row-menu"
	shouldShow={(props: ShouldShowProps) => {
		if (!props.editor.isEditable) return false;
		if (!props.state) {
			return false;
		}
		return isRowGripSelected({
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
	<EdraToolTip tooltip="Add Row After">
		<Button variant="ghost" size="icon" onclick={() => editor.chain().focus().addRowAfter().run()}>
			<ArrowDownFromLine />
		</Button>
	</EdraToolTip>
	<EdraToolTip tooltip="Add Row Before">
		<Button variant="ghost" size="icon" onclick={() => editor.chain().focus().addRowBefore().run()}>
			<ArrowUpFromLine />
		</Button>
	</EdraToolTip>

	<EdraToolTip tooltip="Delete This Row">
		<Button variant="ghost" size="icon" onclick={() => editor.chain().focus().deleteRow().run()}>
			<Trash />
		</Button>
	</EdraToolTip>
</BubbleMenu>
