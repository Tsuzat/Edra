<script lang="ts">
	import { onMount, tick, type Snippet } from 'svelte';
	import { computePosition, flip, shift, offset } from '@floating-ui/dom';

	interface Props {
		open?: boolean;
		side?: 'top' | 'bottom' | 'left' | 'right';
		align?: 'start' | 'center' | 'end';
		children: Snippet<[]>;
		trigger: Snippet<[]>;
		portalProps?: { to?: HTMLElement | undefined };
		class?: string;
	}

	let {
		open = $bindable(false),
		side = 'bottom',
		align = 'center',
		children,
		trigger,
		portalProps,
		class: className = ''
	}: Props = $props();

	let triggerEl = $state<HTMLElement | null>(null);
	let popoverEl = $state<HTMLElement | null>(null);

	$effect(() => {
		if (open && triggerEl && popoverEl) {
			updatePosition();
		}
	});

	function updatePosition() {
		if (!triggerEl || !popoverEl) return;
		const placement = `${side}${align !== 'center' ? '-' + align : ''}` as any;
		computePosition(triggerEl, popoverEl, {
			placement,
			middleware: [offset(6), flip(), shift({ padding: 8 })]
		}).then(({ x, y }) => {
			if (popoverEl) {
				popoverEl.style.left = `${x}px`;
				popoverEl.style.top = `${y}px`;
			}
		});
	}

	function handleOutsideClick(event: MouseEvent) {
		if (!open) return;
		const target = event.target as HTMLElement;
		if (triggerEl && !triggerEl.contains(target) && popoverEl && !popoverEl.contains(target)) {
			open = false;
		}
	}
</script>

<svelte:document onclick={handleOutsideClick} />

<div class="popover-wrapper">
	<span
		bind:this={triggerEl}
		onclick={(e) => {
			e.stopPropagation();
			open = !open;
		}}
	>
		{@render trigger()}
	</span>

	{#if open}
		<div
			bind:this={popoverEl}
			class="edra-popover-content {className}"
			style="position: fixed; width: max-content; left: 0; top: 0;"
		>
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.popover-wrapper {
		display: inline-block;
		position: relative;
	}
</style>
