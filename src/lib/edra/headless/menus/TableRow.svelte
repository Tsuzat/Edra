<script lang="ts">
	import { type Editor } from '@tiptap/core';
	import ArrowDownFromLine from '@lucide/svelte/icons/arrow-down-from-line';
	import ArrowUpFromLine from '@lucide/svelte/icons/arrow-up-from-line';
	import Trash from '@lucide/svelte/icons/trash';
	import type { ShouldShowProps } from '../../types.js';
	import { isRowGripSelected } from '../../extensions/table/utils.js';
	import BubbleMenu from '../../components/BubbleMenu.svelte';
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
>
	<button
		class="edra-command-button"
		title="Add Column After"
		onclick={() => editor.chain().focus().addRowAfter().run()}
	>
		<ArrowDownFromLine class="edra-toolbar-icon" />
	</button>
	<button
		class="edra-command-button"
		title="Add Column Before"
		onclick={() => editor.chain().focus().addRowBefore().run()}
	>
		<ArrowUpFromLine class="edra-toolbar-icon" />
	</button>
	<button
		class="edra-command-button"
		title="Delete Column"
		onclick={() => editor.chain().focus().deleteRow().run()}
	>
		<Trash class="edra-toolbar-icon" />
	</button>
</BubbleMenu>
