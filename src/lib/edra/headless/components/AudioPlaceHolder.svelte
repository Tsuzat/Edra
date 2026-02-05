<script lang="ts">
	import MediaPlaceHolder from '../../components/MediaPlaceHolder.svelte';
	import type { NodeViewProps } from '@tiptap/core';
	import strings from '../../strings.js';

	const { editor }: NodeViewProps = $props();
	import Audio from '@lucide/svelte/icons/audio-lines';

	function handleClick() {
		const audioUrl = prompt(strings.extension.audio.enterURLPrompt);
		if (audioUrl) {
			editor.chain().focus().setAudio(audioUrl).run();
		}
	}
</script>

<MediaPlaceHolder
	class="edra-media-placeholder-wrapper"
	icon={Audio}
	title={strings.extension.audio.insertPlaceholder}
	onClick={handleClick}
/>
