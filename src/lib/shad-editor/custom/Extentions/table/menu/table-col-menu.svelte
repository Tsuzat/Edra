<script lang="ts">
	import type { ShouldShowProps } from '$lib/shad-editor/menus/types.js';
	import { type Editor } from '@tiptap/core';
	import { BubbleMenu } from 'svelte-tiptap';
	import { ArrowLeftFromLine, ArrowRightFromLine, Trash } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { isColumnGripSelected } from './utils.js';
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
	class="flex h-fit w-fit flex-col items-center gap-1 rounded border bg-background p-1 shadow-lg"
>
	<Button
		variant="ghost"
		class="h-8 w-full justify-start gap-2 p-1"
		onclick={() => editor.chain().focus().addColumnAfter().run()}
	>
		<ArrowRightFromLine />
		<span>Add Column After</span>
	</Button>
	<Button
		variant="ghost"
		class="h-8 w-full justify-start gap-2 p-1"
		onclick={() => editor.chain().focus().addColumnBefore().run()}
	>
		<ArrowLeftFromLine />
		<span>Add Column Before</span>
	</Button>
	<Button
		variant="ghost"
		class="h-8 w-full justify-start gap-2 p-1"
		onclick={() => editor.chain().focus().deleteColumn().run()}
	>
		<Trash />
		<span>Delete Column</span>
	</Button>
</BubbleMenu>
