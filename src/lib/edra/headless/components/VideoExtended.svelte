<script lang="ts">
	import type { NodeViewProps } from '@tiptap/core';
	import MediaExtended from './MediaExtended.svelte';

	const { ...rest }: NodeViewProps = $props();

	let mediaRef = $state<HTMLElement>();
</script>

<MediaExtended bind:mediaRef {...rest}>
	{@const node = rest.node}
	<video
		bind:this={mediaRef}
		src={node.attrs.src}
		controls
		title={node.attrs.title}
		preload="none"
		playsinline
		style="margin: 0; width: 100%;"
	>
		<track kind="captions" />
	</video>
</MediaExtended>
