<script lang="ts">
	import type { NodeViewProps } from '@tiptap/core';
	import Video from 'lucide-svelte/icons/video';
	import { NodeViewWrapper } from 'svelte-tiptap';
	const { editor }: NodeViewProps = $props();

	function handleClick(e: MouseEvent) {
		e.preventDefault();
		const videoUrl = prompt('Enter the URL of the video:');
		if (!videoUrl) {
			return;
		}
		editor.chain().focus().setVideo(videoUrl).run();
	}
</script>

<NodeViewWrapper class="edra-media-placeholder-wrapper" contenteditable="false">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<span
		class="edra-media-placeholder-content"
		onclick={handleClick}
		tabindex="0"
		role="button"
		aria-label="Insert A Video"
	>
		<Video class="edra-media-placeholder-icon" />
		<span class="edra-media-placeholder-text">Insert A Video</span>
	</span>
</NodeViewWrapper>
