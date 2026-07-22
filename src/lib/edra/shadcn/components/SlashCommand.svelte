<script lang="ts">
	import type { EdraCommand } from '$lib/edra/commands/index.js';

	interface FilteredGroup {
		name: string;
		title: string;
		commands: EdraCommand[];
	}

	let {
		items = [],
		command
	}: {
		items: FilteredGroup[];
		command: (item: EdraCommand) => void;
	} = $props();

	let scrollContainer = $state<HTMLElement | null>(null);
	let selectedGroupIndex = $state<number>(0);
	let selectedCommandIndex = $state<number>(0);

	// Flatten all commands into a linear list for easy index math
	const flatCommands = $derived.by(() => {
		const result: { groupIndex: number; commandIndex: number }[] = [];
		if (!items) return result;
		for (let gi = 0; gi < items.length; gi++) {
			for (let ci = 0; ci < items[gi].commands.length; ci++) {
				result.push({ groupIndex: gi, commandIndex: ci });
			}
		}
		return result;
	});

	// Current flat index derived from group/command indices
	const currentFlatIndex = $derived.by(() => {
		return flatCommands.findIndex(
			(fc) => fc.groupIndex === selectedGroupIndex && fc.commandIndex === selectedCommandIndex
		);
	});

	// Reset selection when items change
	$effect(() => {
		if (items) {
			selectedGroupIndex = 0;
			selectedCommandIndex = 0;
		}
	});

	// Scroll active item into view
	$effect(() => {
		const activeItem = document.getElementById(
			`slash-${selectedGroupIndex}-${selectedCommandIndex}`
		);
		if (activeItem && scrollContainer) {
			activeItem.scrollIntoView({ block: 'nearest' });
		}
	});

	const selectItem = (groupIndex: number, commandIndex: number) => {
		const cmd = items[groupIndex].commands[commandIndex];
		command(cmd);
	};

	function navigateDown() {
		if (!flatCommands.length) return;
		const nextIndex = (currentFlatIndex + 1) % flatCommands.length;
		const next = flatCommands[nextIndex];
		selectedGroupIndex = next.groupIndex;
		selectedCommandIndex = next.commandIndex;
	}

	function navigateUp() {
		if (!flatCommands.length) return;
		const prevIndex = (currentFlatIndex - 1 + flatCommands.length) % flatCommands.length;
		const prev = flatCommands[prevIndex];
		selectedGroupIndex = prev.groupIndex;
		selectedCommandIndex = prev.commandIndex;
	}

	// Exported so the Suggestion plugin's onKeyDown can delegate here
	// instead of using a global <svelte:window> listener.
	export function handleKeyDown(e: KeyboardEvent): boolean {
		if (e.key === 'ArrowDown' || ((e.ctrlKey || e.metaKey) && e.key === 'j') || e.key === 'Tab') {
			e.preventDefault();
			navigateDown();
			return true;
		}

		if (
			e.key === 'ArrowUp' ||
			((e.ctrlKey || e.metaKey) && e.key === 'k') ||
			(e.shiftKey && e.key === 'Tab')
		) {
			e.preventDefault();
			navigateUp();
			return true;
		}

		if (e.key === 'Enter') {
			e.preventDefault();
			if (!flatCommands.length) return false;
			selectItem(selectedGroupIndex, selectedCommandIndex);
			return true;
		}

		return false;
	}
</script>

<div
	bind:this={scrollContainer}
	class="max-h-72 w-56 overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md"
	class:hidden={!items.length}
>
	{#each items as grp, groupIndex (groupIndex)}
		<div class="px-2 py-1.5 text-xs font-medium text-muted-foreground select-none">
			{grp.title}
		</div>

		{#each grp.commands as command, commandIndex (commandIndex)}
			{@const Icon = command.icon}
			{@const isActive = selectedGroupIndex === groupIndex && selectedCommandIndex === commandIndex}
			<button
				id={`slash-${groupIndex}-${commandIndex}`}
				class="relative flex w-full cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden transition-colors select-none
					{isActive
					? 'bg-accent text-accent-foreground'
					: 'text-popover-foreground hover:bg-accent hover:text-accent-foreground'}
					[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
				onpointerenter={() => {
					selectedGroupIndex = groupIndex;
					selectedCommandIndex = commandIndex;
				}}
				onclick={() => selectItem(groupIndex, commandIndex)}
			>
				<Icon class="text-muted-foreground" />
				<span>{command.tooltip}</span>
			</button>
		{/each}
	{/each}
</div>
