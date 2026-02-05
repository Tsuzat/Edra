<script lang="ts">
	import MediaPlaceHolder from '../../components/MediaPlaceHolder.svelte';
	import type { NodeViewProps } from '@tiptap/core';
	import strings from '../../strings.js';

	const { editor }: NodeViewProps = $props();
	import Audio from '@lucide/svelte/icons/code-xml';

	function handleClick() {
		const iframUrl = prompt(strings.extension.iframe.enterURLPrompt);
		if (iframUrl) {
			editor.chain().focus().setIframe({ src: iframUrl }).run();
		}
	}
</script>

<MediaPlaceHolder
	class="edra-media-placeholder-wrapper"
	icon={Audio}
	title={strings.extension.iframe.insertPlaceholder}
	onClick={handleClick}
/>
