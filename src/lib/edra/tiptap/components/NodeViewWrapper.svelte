<script lang="ts">
	import { getContext } from 'svelte';
	import type { Snippet } from 'svelte';

	let {
		as = 'div',
		class: className,
		children,
		...props
	}: { as?: string; class?: string; children?: Snippet; [key: string]: unknown } = $props();

	let onDragStartCtx = getContext<() => (event: DragEvent) => void>('onDragStart');
	let decorationClassesCtx = getContext<(() => string) | string | undefined>('decorationClasses');

	let combinedClass = $derived(
		[
			typeof decorationClassesCtx === 'function' ? decorationClassesCtx() : decorationClassesCtx,
			className
		]
			.filter(Boolean)
			.join(' ') || undefined
	);
</script>

<svelte:element
	this={as}
	data-node-view-wrapper="hello"
	class={combinedClass}
	style="white-space: normal"
	ondragstart={onDragStartCtx()}
	{...props}
>
	{#if children}
		{@render children()}
	{/if}
</svelte:element>
