<script lang="ts">
	import { setContext, type Component as SvelteComponent } from 'svelte';

	let {
		component: Component,
		onDragStart,
		decorationClasses,
		...props
	}: {
		component: SvelteComponent;
		onDragStart: (event: DragEvent) => void;
		decorationClasses: string;
		[key: string]: unknown;
	} = $props();

	setContext('onDragStart', onDragStart);
	// Svelte 5：传 getter 才能让 NodeViewWrapper 跟到 decoration 更新
	setContext('decorationClasses', () => decorationClasses);
</script>

<Component {...props} />
