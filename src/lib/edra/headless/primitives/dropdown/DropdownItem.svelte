<script lang="ts">
	import { getDropdown } from './context.ts';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		onclick?: (e: MouseEvent) => void;
		children: Snippet<[]>;
	}

	let { class: className = '', onclick, children }: Props = $props();

	const ctx = getDropdown();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onclick?.(new MouseEvent('click'));
			ctx.close();
		}
	}
</script>

<!-- svelte-ignore a11y_interactive_supports_focus -->
<div
	role="menuitem"
	tabindex="0"
	class="dropdown-item {className}"
	onclick={(e) => {
		onclick?.(e);
		ctx.close();
	}}
	onkeydown={handleKeydown}
>
	{@render children()}
</div>

<style>
	.dropdown-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.375rem 0.5rem;
		font-size: 0.875rem;
		border-radius: var(--edra-radius-sm);
		cursor: pointer;
		user-select: none;
		transition: all 150ms ease;
		outline: none;
	}
	.dropdown-item:hover,
	.dropdown-item:focus {
		background-color: var(--edra-canvas-soft-2);
	}
</style>
