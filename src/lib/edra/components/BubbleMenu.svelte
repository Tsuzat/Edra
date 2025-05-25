<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { BubbleMenuPlugin, type BubbleMenuPluginProps } from '@tiptap/extension-bubble-menu';

	interface Props extends BubbleMenuPluginProps {
		children?: Snippet<[]>;
		class?: string;
	}

	let {
		editor,
		shouldShow = null,
		element,
		class: className,
		children,
		updateDelay = 100,
		pluginKey = 'SvelteTiptapBubbleMenu'
	}: Props = $props();

	onMount(() => {
		const plugin = BubbleMenuPlugin({
			pluginKey,
			editor,
			element,
			shouldShow,
			updateDelay
		});

		editor.registerPlugin(plugin);

		return () => editor.unregisterPlugin(pluginKey);
	});
</script>

<div bind:this={element} class={className} style="visibility: hidden;">
	{@render children?.()}
</div>
