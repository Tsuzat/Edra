<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		tooltip: string;
		children: Snippet<[]>;
		shortCut?: string;
	}

	const { tooltip, children, shortCut }: Props = $props();
</script>

<span data-tooltip={shortCut ? `${tooltip} (${shortCut})` : tooltip} class="relative inline-block">
	{@render children()}
</span>
