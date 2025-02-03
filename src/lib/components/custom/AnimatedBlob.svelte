<script lang="ts">
	import { cn } from '$lib/utils.js';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<div
	class={cn(
		'absolute size-36 animate-blob  rounded-full opacity-50 mix-blend-multiply blur-2xl sm:size-72 sm:blur-3xl',
		className
	)}
></div>
