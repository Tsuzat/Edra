<script lang="ts">
	import { icons } from 'lucide-svelte';

	interface Props {
		props: Record<string, any>;
	}

	const { props }: Props = $props();

	let scrollContainer = $state<HTMLElement | null>(null);

	let selectedGroupIndex = $state<number>(0);
	let selectedCommandIndex = $state<number>(0);

	const items = $derived.by(() => props.items);

	$effect(() => {
		if (items) {
			selectedGroupIndex = 0;
			selectedCommandIndex = 0;
		}
	});

	$effect(() => {
		const activeItem = document.getElementById(`${selectedGroupIndex}-${selectedCommandIndex}`);
		if (activeItem !== null && scrollContainer !== null) {
			const offsetTop = activeItem.offsetTop;
			const offsetHeight = activeItem.offsetHeight;
			scrollContainer.scrollTop = offsetTop - offsetHeight;
		}
	});

	const selectItem = (groupIndex: number, commandIndex: number) => {
		const command = props.items[groupIndex].commands[commandIndex];
		props.command(command);
	};

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (!props.items.length) {
				return false;
			}
			const commands = props.items[selectedGroupIndex].commands;
			let newCommandIndex = selectedCommandIndex + 1;
			let newGroupIndex = selectedGroupIndex;
			if (commands.length - 1 < newCommandIndex) {
				newCommandIndex = 0;
				newGroupIndex = selectedGroupIndex + 1;
			}

			if (props.items.length - 1 < newGroupIndex) {
				newGroupIndex = 0;
			}
			selectedCommandIndex = newCommandIndex;
			selectedGroupIndex = newGroupIndex;
			return true;
		}

		if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (!props.items.length) {
				return false;
			}
			let newCommandIndex = selectedCommandIndex - 1;
			let newGroupIndex = selectedGroupIndex;
			if (newCommandIndex < 0) {
				newGroupIndex = selectedGroupIndex - 1;
				newCommandIndex = props.items[newGroupIndex]?.commands.length - 1 || 0;
			}
			if (newGroupIndex < 0) {
				newGroupIndex = props.items.length - 1;
				newCommandIndex = props.items[newGroupIndex].commands.length - 1;
			}
			selectedCommandIndex = newCommandIndex;
			selectedGroupIndex = newGroupIndex;
			return true;
		}

		if (e.key === 'Enter') {
			e.preventDefault();
			if (!props.items.length || selectedGroupIndex === -1 || selectedCommandIndex === -1) {
				return false;
			}
			selectItem(selectedGroupIndex, selectedCommandIndex);
			return true;
		}
		return false;
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if items.length}
	<div bind:this={scrollContainer} class="edra-slash-command-list">
		{#each items as grp, groupIndex}
			<span class="edra-slash-command-list-title">{grp.title}</span>

			{#each grp.commands as command, commandIndex}
				{@const Icon = icons[command.iconName]}
				{@const isActive =
					selectedGroupIndex === groupIndex && selectedCommandIndex === commandIndex}
				<button
					id={`${groupIndex}-${commandIndex}`}
					class="edra-slash-command-list-item"
					class:active={isActive}
					onclick={() => selectItem(groupIndex, commandIndex)}
				>
					<Icon class="edra-toolbar-icon" />
					<span>{command.label}</span>
				</button>
			{/each}
		{/each}
	</div>
{/if}

<style>
	.edra-slash-command-list {
		margin-bottom: 2rem;
		max-height: min(80vh, 20rem);
		width: 12rem;
		overflow: auto;
		scroll-behavior: smooth;
		border-radius: 0.25rem;
		border: 1px solid;
		padding: 0.5rem;
		backdrop-filter: blur(8px);
	}

	.edra-slash-command-list-title {
		margin: 0.5rem;
		user-select: none;
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.025em;
	}

	.edra-slash-command-list-item {
		display: flex;
		height: fit-content;
		width: 100%;
		align-items: center;
		justify-content: flex-start;
		gap: 0.5rem;
		padding: 0.5rem;
		background: none;
		border: none;
		margin: 0.25rem 0;
		border-radius: 0.25rem;
	}
	.edra-slash-command-list-item.active {
		background-color: #80808050;
	}
</style>
