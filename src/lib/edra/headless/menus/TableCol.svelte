<script lang="ts">
	import { type Editor } from '@tiptap/core';
	import ArrowLeftFromLine from '@lucide/svelte/icons/arrow-left-from-line';
	import ArrowRightFromLine from '@lucide/svelte/icons/arrow-right-from-line';
	import Trash from '@lucide/svelte/icons/trash';
	import type { ShouldShowProps } from '../../types.js';
	import { isColumnGripSelected } from '../../extensions/table/utils.js';
	import BubbleMenu from '../../components/BubbleMenu.svelte';
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
>
	<button
		class="edra-command-button"
		title="Add Column After"
		onclick={() => editor.chain().focus().addColumnAfter().run()}
	>
		<ArrowRightFromLine class="edra-toolbar-icon" />
	</button>
	<button
		class="edra-command-button"
		title="Add Column Before"
		onclick={() => editor.chain().focus().addColumnBefore().run()}
	>
		<ArrowLeftFromLine class="edra-toolbar-icon" />
	</button>
	<button
		class="edra-command-button"
		title="Delete Column"
		onclick={() => editor.chain().focus().deleteColumn().run()}
	>
		<Trash class="edra-toolbar-icon" />
	</button>
</BubbleMenu>
