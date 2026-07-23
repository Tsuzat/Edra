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

	setContext('onDragStart', () => onDragStart);
	setContext('decorationClasses', () => decorationClasses);
</script>

<Component {...props} />
