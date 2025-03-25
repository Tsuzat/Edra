<script lang="ts">
	import type { NodeViewProps } from '@tiptap/core';
	import Image from 'lucide-svelte/icons/image';
	import { NodeViewWrapper } from 'svelte-tiptap';
	const { editor }: NodeViewProps = $props();

	function handleClick(e: MouseEvent) {
		e.preventDefault();
		const imageUrl = prompt('Enter the URL of an image:');
		if (!imageUrl) {
			return;
		}
		editor.chain().focus().setImage({ src: imageUrl }).run();
	}
</script>

<NodeViewWrapper class="edra-media-placeholder-wrapper" contenteditable="false">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<span
		class="edra-media-placeholder-content"
		onclick={handleClick}
		tabindex="0"
		role="button"
		aria-label="Insert An Image"
	>
		<Image class="edra-media-placeholder-icon" />
		<span class="edra-media-placeholder-text">Insert An Image</span>
	</span>
</NodeViewWrapper>
