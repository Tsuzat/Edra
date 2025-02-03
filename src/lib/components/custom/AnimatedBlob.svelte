<script lang="ts">
	import { cn } from '$lib/utils.js';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<div
	class={cn(
		'animate-blob absolute size-72 rounded-full opacity-50 mix-blend-multiply blur-3xl',
		className
	)}
></div>
