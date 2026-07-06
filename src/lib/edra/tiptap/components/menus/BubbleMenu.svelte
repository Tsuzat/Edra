<script lang="ts">
	import type { BubbleMenuPluginProps } from '@tiptap/extension-bubble-menu';
	import { BubbleMenuPlugin } from '@tiptap/extension-bubble-menu';
	import type { Editor } from '../../Editor.ts';
	import type { Snippet } from 'svelte';
	interface Props {
		editor: Editor;
		pluginKey?: BubbleMenuPluginProps['pluginKey'];
		updateDelay?: BubbleMenuPluginProps['updateDelay'];
		resizeDelay?: BubbleMenuPluginProps['resizeDelay'];
		options?: BubbleMenuPluginProps['options'];
		appendTo?: BubbleMenuPluginProps['appendTo'];
		shouldShow?: BubbleMenuPluginProps['shouldShow'];
		getReferencedVirtualElement?: BubbleMenuPluginProps['getReferencedVirtualElement'];
		children: Snippet<[]>;
		class?: string;
		[key: string]: unknown;
	}

	let {
		editor,
		pluginKey = 'bubbleMenu',
		updateDelay = undefined,
		resizeDelay = undefined,
		options = {},
		appendTo = undefined,
		shouldShow = null,
		getReferencedVirtualElement = undefined,
		children,
		class: className,
		...rest
	}: Props = $props();

	let rootEl: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (!rootEl || !editor) {
			return;
		}

		const el = rootEl;

		el.style.visibility = 'hidden';
		el.style.position = 'absolute';

		el.remove();

		editor.registerPlugin(
			BubbleMenuPlugin({
				editor,
				element: el,
				options,
				pluginKey,
				resizeDelay,
				appendTo,
				shouldShow,
				getReferencedVirtualElement,
				updateDelay
			})
		);

		return () => {
			editor.unregisterPlugin(pluginKey);
		};
	});
</script>

<div bind:this={rootEl} class={className} {...rest}>
	{@render children()}
</div>
