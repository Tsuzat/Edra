<script lang="ts">
	import type { NodeViewProps } from '@tiptap/core';
	import AudioLines from 'lucide-svelte/icons/audio-lines';
	import { NodeViewWrapper } from 'svelte-tiptap';
	const { editor }: NodeViewProps = $props();

	function handleClick(e: MouseEvent) {
		e.preventDefault();
		const audioUrl = prompt('Enter the URL of an audio:');
		if (!audioUrl) {
			return;
		}
		editor.chain().focus().setAudio(audioUrl).run();
	}
</script>

<NodeViewWrapper class="edra-media-placeholder-wrapper" contenteditable="false">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<span
		class="edra-media-placeholder-content"
		onclick={handleClick}
		tabindex="0"
		role="button"
		aria-label="Insert An Audio"
	>
		<AudioLines class="edra-media-placeholder-icon" />
		<span class="edra-media-placeholder-text">Insert An Audio</span>
	</span>
</NodeViewWrapper>
