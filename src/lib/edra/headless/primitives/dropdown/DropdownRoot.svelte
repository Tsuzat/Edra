<script lang="ts">
	import { setDropdown } from './context.ts';
	import type { Snippet } from 'svelte';

	interface Props {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		children: Snippet<[]>;
	}

	let { open = $bindable(false), onOpenChange, children }: Props = $props();

	let triggerEl = $state<HTMLElement | null>(null);
	let contentEl = $state<HTMLElement | null>(null);

	const context = {
		get open() {
			return open;
		},
		set open(val) {
			open = val;
			onOpenChange?.(val);
		},
		get triggerEl() {
			return triggerEl;
		},
		set triggerEl(val) {
			triggerEl = val;
		},
		get contentEl() {
			return contentEl;
		},
		set contentEl(val) {
			contentEl = val;
		},
		close() {
			open = false;
			onOpenChange?.(false);
		},
		toggle() {
			open = !open;
			onOpenChange?.(open);
		},
		setTrigger(el: HTMLElement | null) {
			triggerEl = el;
		},
		setContent(el: HTMLElement | null) {
			contentEl = el;
		}
	};

	setDropdown(context);

	function handleOutsideClick(event: MouseEvent) {
		if (!open) return;
		const target = event.target as HTMLElement;
		if (triggerEl && !triggerEl.contains(target) && contentEl && !contentEl.contains(target)) {
			open = false;
			onOpenChange?.(false);
		}
	}
</script>

<svelte:document onclick={handleOutsideClick} />

<div class="dropdown-root">
	{@render children()}
</div>

<style>
	.dropdown-root {
		position: relative;
		display: inline-block;
	}
</style>
