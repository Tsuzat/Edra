<script lang="ts">
	import MediaPlaceHolder from '../../components/MediaPlaceHolder.svelte';
	import type { NodeViewProps } from '@tiptap/core';

	const { editor }: NodeViewProps = $props();
	import Video from '@lucide/svelte/icons/video';

	function handleClick() {
		const videoUrl = prompt('Please enter the video URL');
		if (videoUrl) {
			editor.chain().focus().setVideo(videoUrl).run();
		}
	}
</script>

<MediaPlaceHolder
	class="edra-media-placeholder-wrapper"
	icon={Video}
	title="Insert a video"
	onClick={handleClick}
/>
