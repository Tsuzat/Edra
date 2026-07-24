<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import type { Snippet } from 'svelte';

	interface Props {
		tooltip: string;
		class?: string;
		children: Snippet<[]>;
		shortCut?: string;
	}

	const { tooltip, class: className, children, shortCut }: Props = $props();
</script>

<Tooltip.Root delayDuration={100}>
	<Tooltip.Trigger class={className}>
		{@render children()}
	</Tooltip.Trigger>
	<Tooltip.Content>
		<span>{tooltip}</span>
		{#if shortCut}
			<span class="rounded bg-background p-0.5 text-primary">{shortCut}</span>
		{/if}
	</Tooltip.Content>
</Tooltip.Root>
