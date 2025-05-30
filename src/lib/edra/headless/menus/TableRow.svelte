<script lang="ts">
	import type { ShouldShowProps } from '../../types.js';
	import { type Editor } from '@tiptap/core';
	import ArrowDownFromLine from '@lucide/svelte/icons/arrow-down-from-line';
	import ArrowUpFromLine from '@lucide/svelte/icons/arrow-up-from-line';
	import Trash from '@lucide/svelte/icons/trash';
	import Button from '$lib/components/ui/button/button.svelte';
	import { isRowGripSelected } from '../../extensions/table/utils.js';
	import BubbleMenu from '$lib/edra/components/BubbleMenu.svelte';
	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();
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
	class="edra-menu-wrapper"
>
	<Button variant="ghost" size="icon" onclick={() => editor.chain().focus().addRowAfter().run()}>
		<ArrowDownFromLine />
	</Button>
	<Button variant="ghost" size="icon" onclick={() => editor.chain().focus().addRowBefore().run()}>
		<ArrowUpFromLine />
	</Button>
	<Button variant="ghost" size="icon" onclick={() => editor.chain().focus().deleteRow().run()}>
		<Trash />
	</Button>
</BubbleMenu>
