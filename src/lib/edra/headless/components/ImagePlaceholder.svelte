<script lang="ts">
	import MediaPlaceHolder from '../../components/MediaPlaceHolder.svelte';
	import type { NodeViewProps } from '@tiptap/core';
	import strings from '../../strings.js';

	const { editor }: NodeViewProps = $props();
	import Image from '@lucide/svelte/icons/image';

	function handleClick() {
		const imageUrl = prompt(strings.extension.image.enterURLPrompt);
		if (imageUrl) {
			editor.chain().focus().setImage({ src: imageUrl }).run();
		}
	}
</script>

<MediaPlaceHolder
	class="edra-media-placeholder-wrapper"
	icon={Image}
	title={strings.extension.image.insertPlaceholder}
	onClick={handleClick}
/>
