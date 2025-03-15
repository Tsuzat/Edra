<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet<[]>;
		content: string;
		shortCut?: string;
	}

	const { children, content, shortCut }: Props = $props();
</script>

<Tooltip.Provider delayDuration={0} skipDelayDuration={0}>
	<Tooltip.Root>
		<Tooltip.Trigger class="size-fit">
			{@render children()}
		</Tooltip.Trigger>
		<Tooltip.Content
			class="flex items-center gap-1 rounded border-2 bg-background text-xs font-medium text-foreground"
		>
			<p>{content}</p>
			<p class="text-muted-foreground">{shortCut}</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
