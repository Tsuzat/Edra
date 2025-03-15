<script lang="ts">
	import type { ShouldShowProps } from '../../../utils.js';
	import { type Editor } from '@tiptap/core';
	import { BubbleMenu } from 'svelte-tiptap';
	import ArrowDownFromLine from 'lucide-svelte/icons/arrow-down-from-line';
	import ArrowUpFromLine from 'lucide-svelte/icons/arrow-up-from-line';
	import Trash from 'lucide-svelte/icons/trash';
	import { isRowGripSelected } from '../../../extensions/table/utils.js';
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
	class="edra-menu-wrapper"
>
	<button
		class="edra-command-button"
		title="Add Row After"
		onclick={() => editor.chain().focus().addRowAfter().run()}
	>
		<ArrowDownFromLine class="edra-toolbar-icon" />
	</button>
	<button
		class="edra-command-button"
		title="Add Row Before"
		onclick={() => editor.chain().focus().addRowBefore().run()}
	>
		<ArrowUpFromLine class="edra-toolbar-icon" />
	</button>
	<button
		class="edra-command-button"
		title="Delete Row"
		onclick={() => editor.chain().focus().deleteRow().run()}
	>
		<Trash class="edra-toolbar-icon" />
	</button>
</BubbleMenu>
