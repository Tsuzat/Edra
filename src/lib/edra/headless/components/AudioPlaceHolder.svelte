<script lang="ts">
	import MediaPlaceHolder from '../../components/MediaPlaceHolder.svelte';
	import type { NodeViewProps } from '@tiptap/core';

	const { editor }: NodeViewProps = $props();
	import Audio from '@lucide/svelte/icons/audio-lines';

	function handleClick() {
		const audioUrl = prompt('Please enter the audio URL');
		if (audioUrl) {
			editor.chain().focus().setAudio(audioUrl).run();
		}
	}
</script>

<MediaPlaceHolder
	class="edra-media-placeholder-wrapper"
	icon={Audio}
	title="Insert an audio"
	onClick={handleClick}
/>
