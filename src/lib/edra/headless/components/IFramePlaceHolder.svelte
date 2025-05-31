<script lang="ts">
	import MediaPlaceHolder from '../../components/MediaPlaceHolder.svelte';
	import type { NodeViewProps } from '@tiptap/core';

	const { editor }: NodeViewProps = $props();
	import Audio from '@lucide/svelte/icons/code-xml';

	function handleClick() {
		const iframUrl = prompt('Please enter the IFrame URL');
		if (iframUrl) {
			editor.chain().focus().setIframe({ src: iframUrl }).run();
		}
	}
</script>

<MediaPlaceHolder
	class="edra-media-placeholder-wrapper"
	icon={Audio}
	title="Insert an iframe"
	onClick={handleClick}
/>
