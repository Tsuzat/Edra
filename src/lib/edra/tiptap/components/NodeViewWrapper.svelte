<script lang="ts">
	import { getContext } from 'svelte';
	import type { Snippet } from 'svelte';

	let {
		as = 'div',
		class: className,
		children,
		...props
	}: { as?: string; class?: string; children?: Snippet; [key: string]: unknown } = $props();

	let onDragStart = getContext<(event: DragEvent) => void>('onDragStart');
	let decorationClasses = getContext<string>('decorationClasses');

	let combinedClass = $derived(
		[decorationClasses, className].filter(Boolean).join(' ') || undefined
	);
</script>

<svelte:element
	this={as}
	data-node-view-wrapper="hello"
	class={combinedClass}
	style="white-space: normal"
	ondragstart={onDragStart}
	{...props}
>
	{#if children}
		{@render children()}
	{/if}
</svelte:element>
