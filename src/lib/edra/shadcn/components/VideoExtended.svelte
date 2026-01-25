<script lang="ts">
	import type { NodeViewProps } from '@tiptap/core';
	import MediaExtended from './MediaExtended.svelte';

	const { ...rest }: NodeViewProps = $props();

	let mediaRef = $state<HTMLElement>();
</script>

<MediaExtended bind:mediaRef {...rest}>
	{@const node = rest.node}
	<!-- svelte-ignore element_invalid_self_closing_tag -->
	<!-- svelte-ignore a11y_media_has_caption -->
	<video
		preload="none"
		bind:this={mediaRef}
		src={node.attrs.src}
		playsinline
		controls
		title={node.attrs.title}
	/>
</MediaExtended>
