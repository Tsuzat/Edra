<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { cn } from '$lib/utils.js';
	import { Table, ChevronDown } from 'lucide-svelte';
	import type { ToolBarIconProps } from './types.js';

	let { editor, toolTipProps = { delayDuration: 0, disabled: false } }: ToolBarIconProps = $props();

	const isTableActive = $derived.by(() => editor.isActive('table'));

	let rows = $state(3);
	let cols = $state(3);
	const blocks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	let open = $state(false);
</script>

<DropdownMenu.Root bind:open>
	<DropdownMenu.Trigger>
		<Tooltip.Provider {...toolTipProps}>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button
						variant="ghost"
						size="sm"
						class={cn('h-8 gap-1 p-1', isTableActive && 'bg-muted')}
					>
						<Table />
						<ChevronDown class="!size-2 text-muted-foreground" />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Table</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="h-fit w-fit overflow-auto">
		{#if isTableActive}
			<DropdownMenu.Item
				onclick={() =>
					editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: false }).run()}
			>
				<span>Insert Table</span>
			</DropdownMenu.Item>
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger>
					<span>Cells</span>
				</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent>
					<DropdownMenu.Item onclick={() => editor.chain().focus().mergeCells().run()}>
						<span>Merge</span>
					</DropdownMenu.Item>
					<DropdownMenu.Item onclick={() => editor.chain().focus().splitCell().run()}>
						<span>Split</span>
					</DropdownMenu.Item>
					<DropdownMenu.Item onclick={() => editor.chain().focus().mergeOrSplit().run()}>
						<span>Merge or Split</span>
					</DropdownMenu.Item>
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger>
					<span>Row</span>
				</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent>
					<DropdownMenu.Item onclick={() => editor.chain().focus().addRowBefore().run()}>
						<span>Insert Above</span>
					</DropdownMenu.Item>
					<DropdownMenu.Item onclick={() => editor.chain().focus().addRowAfter().run()}>
						<span>Insert Below</span>
					</DropdownMenu.Item>
					<DropdownMenu.Item
						onclick={() => editor.chain().focus().deleteRow().run()}
						class="text-destructive hover:text-foreground data-[highlighted]:bg-destructive"
					>
						<span>Delete Row</span>
					</DropdownMenu.Item>
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger>
					<span>Column</span>
				</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent>
					<DropdownMenu.Item onclick={() => editor.chain().focus().addColumnBefore().run()}>
						<span>Insert Before</span>
					</DropdownMenu.Item>
					<DropdownMenu.Item onclick={() => editor.chain().focus().addColumnAfter().run()}>
						<span>Insert After</span>
					</DropdownMenu.Item>
					<DropdownMenu.Item
						onclick={() => editor.chain().focus().deleteColumn().run()}
						class="text-destructive hover:text-foreground data-[highlighted]:bg-destructive"
					>
						<span>Delete</span>
					</DropdownMenu.Item>
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
			<DropdownMenu.Item
				onclick={() => editor.chain().focus().deleteTable().run()}
				class="text-destructive hover:text-foreground data-[highlighted]:bg-destructive"
			>
				<span>Delete</span>
			</DropdownMenu.Item>
		{:else}
			<div class="mb-4 flex flex-col gap-1 p-1">
				{#each blocks as row}
					<div class="flex gap-1">
						{#each blocks as col}
							<Button
								variant="outline"
								role="button"
								class={cn(
									'size-4 rounded-none bg-muted/20 p-0',
									row <= rows && col <= cols && 'bg-muted'
								)}
								title={`Rows:${rows}, Columns:${cols}`}
								onmouseenter={() => {
									cols = col;
									rows = row;
								}}
								onclick={() => {
									editor.chain().focus().insertTable({ rows, cols, withHeaderRow: false }).run();
									open = false;
								}}
							></Button>
						{/each}
					</div>
				{/each}
			</div>
			<span class="text-xs">
				Rows: {rows}, Columns: {cols}
			</span>
		{/if}
	</DropdownMenu.Content>
</DropdownMenu.Root>
