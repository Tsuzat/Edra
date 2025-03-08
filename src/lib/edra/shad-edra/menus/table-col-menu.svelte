<script lang="ts">
	import { type Editor } from '@tiptap/core';
	import { BubbleMenu } from 'svelte-tiptap';
	import ArrowLeftFromLine from 'lucide-svelte/icons/arrow-left-from-line';
	import ArrowRightFromLine from 'lucide-svelte/icons/arrow-right-from-line';
	import Trash from 'lucide-svelte/icons/trash';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { ShouldShowProps } from '../../utils.js';
	import { isColumnGripSelected } from '../../extensions/table/utils.js';
	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();
</script>

<BubbleMenu
	{editor}
	pluginKey="table-col-menu"
	shouldShow={(props: ShouldShowProps) => {
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
	class="flex h-fit w-fit items-center gap-1 rounded border bg-background p-1 shadow-lg"
>
	<Button
		variant="ghost"
		class="size-6 p-0"
		onclick={() => editor.chain().focus().addColumnAfter().run()}
		title="Add Column After"
	>
		<ArrowRightFromLine />
	</Button>
	<Button
		variant="ghost"
		class="size-6 p-0"
		onclick={() => editor.chain().focus().addColumnBefore().run()}
		title="Add Column Before"
	>
		<ArrowLeftFromLine />
	</Button>
	<Button
		variant="ghost"
		class="size-6 p-0"
		onclick={() => editor.chain().focus().deleteColumn().run()}
		title="Delete Column"
	>
		<Trash />
	</Button>
</BubbleMenu>
