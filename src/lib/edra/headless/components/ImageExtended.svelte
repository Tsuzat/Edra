<script lang="ts">
	import type { NodeViewProps } from '@tiptap/core';
	import MediaExtended from './MediaExtended.svelte';

	const { ...rest }: NodeViewProps = $props();

	let mediaRef = $state<HTMLElement>();
</script>

<MediaExtended bind:mediaRef {...rest}>
	{@const node = rest.node}
	<img
		bind:this={mediaRef}
		src={node.attrs.src}
		alt={node.attrs.alt}
		title={node.attrs.title}
		class="img-custom"
	/>
</MediaExtended>

<style>
	.img-custom {
		margin: 0;
		width: 100%;
		border-radius: var(--edra-radius-md);
		object-fit: cover;
	}
</style>
