<script lang="ts">
	import type { ShouldShowProps } from '../../types.js';
	import { type Editor } from '@tiptap/core';
	import ArrowLeftFromLine from '@lucide/svelte/icons/arrow-left-from-line';
	import ArrowRightFromLine from '@lucide/svelte/icons/arrow-right-from-line';

	import Trash from '@lucide/svelte/icons/trash';
	import Button from '$lib/components/ui/button/button.svelte';
	import { isColumnGripSelected } from '../../extensions/table/utils.js';
	import BubbleMenu from '$lib/edra/components/BubbleMenu.svelte';
	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();
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
	class="edra-menu-wrapper"
>
	<Button variant="ghost" size="icon" onclick={() => editor.chain().focus().addColumnAfter().run()}>
		<ArrowRightFromLine />
	</Button>
	<Button
		variant="ghost"
		size="icon"
		onclick={() => editor.chain().focus().addColumnBefore().run()}
	>
		<ArrowLeftFromLine />
	</Button>

	<Button variant="ghost" size="icon" onclick={() => editor.chain().focus().deleteColumn().run()}>
		<Trash />
	</Button>
</BubbleMenu>
