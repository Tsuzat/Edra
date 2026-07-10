<script lang="ts">
	import { getDropdown } from './context.ts';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children: Snippet<[]>;
		title?: string;
	}

	let { class: className = '', children, title }: Props = $props();

	const ctx = getDropdown();
	let element = $state<HTMLElement | null>(null);

	$effect(() => {
		ctx.setTrigger(element);
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			ctx.open = true;
		}
	}
</script>

<button
	bind:this={element}
	type="button"
	class="edra-btn edra-btn-ghost edra-btn-icon {className}"
	{title}
	onclick={(e) => {
		e.stopPropagation();
		ctx.toggle();
	}}
	onkeydown={handleKeydown}
	aria-haspopup="menu"
	aria-expanded={ctx.open}
>
	{@render children()}
</button>
