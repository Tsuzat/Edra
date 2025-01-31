<script lang="ts">
	import { getAttributes, type Editor } from '@tiptap/core';
	import { BubbleMenu } from 'svelte-tiptap';
	import type { ShouldShowProps } from './types.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Copy, Trash } from 'lucide-svelte';

	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();

	const link = $derived.by(() => editor.getAttributes('link').href);
</script>

<BubbleMenu
	{editor}
	shouldShow={(props: ShouldShowProps) => {
		return props.editor.isActive('link');
	}}
	class="flex h-fit w-fit items-center gap-1 rounded border bg-background p-1 shadow-lg"
>
	<!-- <a
		href={link}
		class="h-8 w-40 overflow-hidden text-ellipsis underline"
		aria-label="link"
		target="_blank"
		title={'Open link: ' + link}
		rel="noopener noreferrer">{link}</a
	> -->
	<Button variant="link" href={link} class="max-w-80 p-1" target="_blank">
		<span class="w-full overflow-hidden text-ellipsis">
			{link}
		</span>
	</Button>
	<Button
		variant="ghost"
		title="Copy Link"
		class="size-7 p-1"
		onclick={() => {
			navigator.clipboard.writeText(link);
		}}
	>
		<Copy />
	</Button>
	<Button
		variant="ghost"
		title="Remove Link"
		class="size-7 p-1"
		onclick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}
	>
		<Trash />
	</Button>
</BubbleMenu>
