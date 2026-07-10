<script lang="ts">
	import { getContext } from 'svelte';
	import { computePosition, flip, shift, offset } from '@floating-ui/dom';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children: Snippet<[]>;
	}

	let { class: className = '', children }: Props = $props();

	const subCtx = getContext<any>('edra-dropdown-sub');
	let element = $state<HTMLElement | null>(null);

	$effect(() => {
		subCtx.contentEl = element;
	});

	$effect(() => {
		if (subCtx.open && subCtx.triggerEl && element) {
			updatePosition();
		}
	});

	function updatePosition() {
		if (!subCtx.triggerEl || !element) return;
		computePosition(subCtx.triggerEl, element, {
			placement: 'right-start',
			middleware: [offset(4), flip(), shift({ padding: 8 })]
		}).then(({ x, y }) => {
			if (element) {
				element.style.left = `${x}px`;
				element.style.top = `${y}px`;
				element.style.visibility = 'visible';
			}
		});
	}

	let timeout: ReturnType<typeof setTimeout>;

	function handleMouseLeave() {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			if (subCtx.triggerEl && !subCtx.triggerEl.matches(':hover')) {
				subCtx.open = false;
			}
		}, 100);
	}
</script>

{#if subCtx.open}
	<div
		bind:this={element}
		class="edra-dropdown-content dropdown-subcontent {className}"
		style="left: 0; top: 0; width: max-content; min-width: 8rem; visibility: hidden;"
		role="menu"
		onmouseleave={handleMouseLeave}
	>
		{@render children()}
	</div>
{/if}

<style>
	.dropdown-subcontent {
		position: fixed;
		display: flex;
		flex-direction: column;
	}
</style>
