<script lang="ts">
	import type { NodeViewProps } from '@tiptap/core';
	import Image from 'lucide-svelte/icons/image';
	import { NodeViewWrapper } from 'svelte-tiptap';
	const {}: NodeViewProps = $props();
</script>

<NodeViewWrapper class="edra-media-placeholder-wrapper" contenteditable="false">
	<span class="edra-media-placeholder-content">
		<Image class="edra-media-placeholder-icon" />
		<span class="edra-media-placeholder-text">Insert An Image</span>
	</span>
</NodeViewWrapper>
