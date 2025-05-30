<script lang="ts">
	import type { ShouldShowProps } from '../../types.js';
	import BubbleMenu from '../../components/BubbleMenu.svelte';
	import type { Editor } from '@tiptap/core';
	import Copy from '@lucide/svelte/icons/copy';
	import Trash from '@lucide/svelte/icons/trash';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();

	let link = $derived.by(() => editor.getAttributes('link').href);
</script>

<BubbleMenu
	{editor}
	pluginKey="link-bubble-menu"
	shouldShow={(props: ShouldShowProps) => {
		if (!props.editor.isEditable) return false;
		return props.editor.isActive('link');
	}}
>
	<a href={link} target="_blank">
		{link}
	</a>
	<button
		title="Copy Link"
		class="edra-command-button"
		onclick={() => {
			navigator.clipboard.writeText(link);
		}}
	>
		<Copy class="edra-toolbar-icon" />
	</button>
	<button
		class="edra-command-button"
		title="Remove Link"
		onclick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}
	>
		<Trash class="edra-toolbar-icon" />
	</button>
</BubbleMenu>
