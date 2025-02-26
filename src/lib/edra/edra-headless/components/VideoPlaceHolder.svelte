<script lang="ts">
	// import type { NodeViewProps } from '@tiptap/core';
	import Video from 'lucide-svelte/icons/video';
	import { NodeViewWrapper } from 'svelte-tiptap';
	// const {}: NodeViewProps = $props();
</script>

<NodeViewWrapper class="edra-media-placeholder-wrapper" contenteditable="false">
	<span class="edra-media-placeholder-content">
		<Video class="edra-media-placeholder-icon" />
		<span class="edra-media-placeholder-text">Insert A Video</span>
	</span>
</NodeViewWrapper>
