<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import type { Snippet } from 'svelte';
	interface Props {
		tooltip: string;
		children: Snippet<[]>;
		shortCut?: string;
	}

	const { tooltip, children, shortCut }: Props = $props();
</script>

<Tooltip.Provider delayDuration={100}>
	<Tooltip.Root>
		<Tooltip.Trigger>
			{@render children()}
		</Tooltip.Trigger>
		<Tooltip.Content>
			<span>{tooltip}</span>
			<span class="bg-background text-primary rounded font-semibold">{shortCut}</span>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
