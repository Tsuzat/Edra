<script lang="ts">
	import type { ShouldShowProps } from '../../utils.js';
	import { type Editor } from '@tiptap/core';
	import { BubbleMenu } from 'svelte-tiptap';
	import ArrowDownFromLine from 'lucide-svelte/icons/arrow-down-from-line';
	import ArrowUpFromLine from 'lucide-svelte/icons/arrow-up-from-line';
	import Trash from 'lucide-svelte/icons/trash';
	import Button from '$lib/components/ui/button/button.svelte';
	import { isRowGripSelected } from '../../extensions/table/utils.js';
	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();
</script>

<BubbleMenu
	{editor}
	pluginKey="table-row-menu"
	shouldShow={(props: ShouldShowProps) => {
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
	class="flex h-fit w-fit items-center gap-1 rounded border bg-background p-1 shadow-lg"
>
	<Button
		variant="ghost"
		class="size-6 rounded-sm p-0"
		onclick={() => editor.chain().focus().addRowAfter().run()}
		title="Add Row After"
	>
		<ArrowDownFromLine />
	</Button>
	<Button
		variant="ghost"
		class="size-6 rounded-sm p-0"
		onclick={() => editor.chain().focus().addRowBefore().run()}
		title="Add Row Before"
	>
		<ArrowUpFromLine />
	</Button>
	<Button
		variant="ghost"
		class="size-6 rounded-sm p-0"
		onclick={() => editor.chain().focus().deleteRow().run()}
		title="Delete Row"
	>
		<Trash />
	</Button>
</BubbleMenu>
