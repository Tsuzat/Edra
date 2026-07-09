<script lang="ts">
	import type { NodeViewProps } from '@tiptap/core';
	import MediaExtended from './MediaExtended.svelte';

	const { ...rest }: NodeViewProps = $props();

	let mediaRef = $state<HTMLElement>();
</script>

<MediaExtended bind:mediaRef {...rest}>
	{@const node = rest.node}
	<iframe bind:this={mediaRef} class="iframe-custom" {...node.attrs} title="IFrame Container">
	</iframe>
</MediaExtended>

<style>
	iframe {
		aspect-ratio: 16 / 9;
		border: 0;
		margin: 0;
		width: 100%;
		border-radius: var(--edra-radius-md);
	}
</style>
