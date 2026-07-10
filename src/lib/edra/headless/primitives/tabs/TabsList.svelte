<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children: Snippet<[]>;
	}

	let { class: className = '', children }: Props = $props();
</script>

<div class="tabs-list {className}" role="tablist">
	{@render children()}
</div>

<style>
	.tabs-list {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem;
		border-radius: var(--edra-radius-md);
		width: fit-content;
		background-color: var(--edra-canvas-soft-2);
	}
</style>
