<script lang="ts" module>
	let tocItems = $state<TableOfContentData>([]);
	export const setTocItems = (items: TableOfContentData) => {
		tocItems = items;
	};
</script>

<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { cn } from '$lib/utils.js';
	import { type TableOfContentData } from '@tiptap/extension-table-of-contents';
</script>

<Tooltip.Provider>
	<Tooltip.Root delayDuration={100}>
		<Tooltip.Trigger class="fixed top-1/3 right-2 my-auto flex flex-col gap-2 print:hidden">
			{#each tocItems as item (item.id)}
				<span
					class={cn(
						'dark:bg-muted bg-muted-foreground/50 block! h-0.5! w-4 rounded!',
						item.isActive && 'bg-primary!',
						item.level === 1 ? 'w-6' : 'w-4'
					)}
				></span>
			{/each}
		</Tooltip.Trigger>
		<Tooltip.Content
			side="left"
			sideOffset={-24}
			align="start"
			class="data-[side=left]:slide-in-from-right-30 fade-in-50 bg-popover flex items-start max-h-120 min-h-8 max-w-56 flex-col gap-1.5 overflow-auto border duration-300"
			arrowClasses="hidden"
			strategy="absolute"
		>
			{#if tocItems === undefined || tocItems.length === 0}
				<div>No contents</div>
			{:else}
				{#each tocItems as item (item.id)}
					<a
						href={`#${item.id}`}
						class={cn(
							'nodefault text-foreground text-sm text-wrap transition-all duration-500',
							item.isScrolledOver && 'text-muted-foreground italic'
						)}
						style={`padding-left: calc(1rem * ${item.level - 1});`}
					>
						{item.textContent}
					</a>
				{/each}
			{/if}
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
