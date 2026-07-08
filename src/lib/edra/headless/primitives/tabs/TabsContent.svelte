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

{#if active}
	<div class="tabs-content {className}" role="tabpanel">
		{@render children()}
	</div>

<style>
	.tabs-content {
		margin-top: 0.5rem;
		width: 100%;
		outline: none;
	}
</style>
{/if}
