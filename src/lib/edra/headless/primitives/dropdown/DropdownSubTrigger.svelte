<script lang="ts">
	import { getContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	interface Props {
		class?: string;
		children: Snippet<[]>;
		openDelay?: number;
	}

	let { class: className = '', children, openDelay = 300 }: Props = $props();

	const subCtx = getContext<any>('edra-dropdown-sub');
	let element = $state<HTMLElement | null>(null);

	$effect(() => {
		subCtx.triggerEl = element;
	});

	let timeout: ReturnType<typeof setTimeout>;

	function handleMouseEnter() {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			subCtx.open = true;
		}, openDelay);
	}

	function handleMouseLeave() {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			if (subCtx.contentEl && !subCtx.contentEl.matches(':hover')) {
				subCtx.open = false;
			}
		}, 100);
	}
</script>

<div
	bind:this={element}
	role="menuitem"
	tabindex="0"
	class="dropdown-subtrigger {className}"
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	onclick={(e) => {
		e.stopPropagation();
		subCtx.open = !subCtx.open;
	}}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			subCtx.open = !subCtx.open;
		}
	}}
>
	{@render children()}
	<ChevronRight class="arrow-icon" />
</div>

<style>
	.dropdown-subtrigger {
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
	.dropdown-subtrigger:hover,
	.dropdown-subtrigger:focus {
		background-color: var(--edra-canvas-soft-2);
	}
	:global(.arrow-icon) {
		margin-left: auto;
		width: 1rem;
		height: 1rem;
		color: var(--edra-mute);
	}
</style>
