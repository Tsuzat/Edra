<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children: Snippet<[]>;
	}

	let { class: className = '', children }: Props = $props();
</script>

<div class="dropdown-label {className}">
	{@render children()}
</div>

<style>
	.dropdown-label {
		padding: 0.375rem 0.5rem;
		font-size: 0.75rem;
		font-weight: 600;
		user-select: none;
		color: var(--edra-mute);
	}
</style>
