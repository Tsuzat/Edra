<script lang="ts">
	import { getDropdown } from './context.ts';
	import { computePosition, flip, shift, offset } from '@floating-ui/dom';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children: Snippet<[]>;
		align?: 'start' | 'center' | 'end';
		side?: 'top' | 'bottom' | 'left' | 'right';
	}

	let { class: className = '', children, align = 'start', side = 'bottom' }: Props = $props();

	const ctx = getDropdown();
	let element = $state<HTMLElement | null>(null);

	$effect(() => {
		ctx.setContent(element);
	});

	$effect(() => {
		if (ctx.open && ctx.triggerEl && element) {
			updatePosition();
		}
	});

	function updatePosition() {
		if (!ctx.triggerEl || !element) return;
		const placement = `${side}${align !== 'center' ? '-' + align : ''}` as any;
		computePosition(ctx.triggerEl, element, {
			placement,
			middleware: [offset(4), flip(), shift({ padding: 8 })]
		}).then(({ x, y }) => {
			if (element) {
				element.style.left = `${x}px`;
				element.style.top = `${y}px`;
				element.style.visibility = 'visible';
			}
		});
	}
</script>

{#if ctx.open}
	<div
		bind:this={element}
		class="edra-dropdown-content dropdown-content {className}"
		style="left: 0; top: 0; width: max-content; min-width: 8rem; visibility: hidden;"
		role="menu"
	>
		{@render children()}
	</div>
{/if}

<style>
	.dropdown-content {
		position: fixed;
		display: flex;
		flex-direction: column;
	}
</style>
