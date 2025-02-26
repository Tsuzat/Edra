<script lang="ts">
	import type { NodeViewProps } from '@tiptap/core';
	import AudioLines from 'lucide-svelte/icons/audio-lines';
	import { NodeViewWrapper } from 'svelte-tiptap';
	const {}: NodeViewProps = $props();
</script>

<NodeViewWrapper class="edra-media-placeholder-wrapper" contenteditable="false">
	<span class="edra-media-placeholder-content">
		<AudioLines class="edra-media-placeholder-icon" />
		<span class="edra-media-placeholder-text">Insert An Audio</span>
	</span>
</NodeViewWrapper>
