<script lang="ts">
	import { getTabs } from './context.ts';
	import type { Snippet } from 'svelte';

	interface Props {
		value: string;
		class?: string;
		children: Snippet<[]>;
	}

	let { value, class: className = '', children }: Props = $props();

	const ctx = getTabs();
	const active = $derived(ctx.value === value);
</script>

<button
	type="button"
	role="tab"
	aria-selected={active}
	tabindex={active ? 0 : -1}
	class="tabs-trigger {active ? 'active' : 'inactive'} {className}"
	onclick={() => ctx.setValue(value)}
>
	{@render children()}
</button>

<style>
	.tabs-trigger {
		padding: 0.375rem 0.75rem;
		font-size: 0.875rem;
		font-weight: 500;
		border-radius: var(--edra-radius-sm);
		cursor: pointer;
		user-select: none;
		transition: all 150ms ease;
		border: 0;
		outline: none;
	}
	.tabs-trigger.active {
		background-color: var(--edra-canvas);
		color: var(--edra-ink);
		box-shadow: var(--edra-shadow-2);
	}
	.tabs-trigger.inactive {
		background-color: transparent;
		color: var(--edra-mute);
	}
	.tabs-trigger.inactive:hover {
		color: var(--edra-ink);
	}
</style>
