<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children: Snippet<[]>;
	}

	let { class: className = '', children }: Props = $props();
</script>

<span class="dropdown-shortcut {className}">
	{@render children()}
</span>

<style>
	.dropdown-shortcut {
		margin-left: auto;
		font-size: 0.75rem;
		padding-left: 4px;
		padding-right: 4px;
		border: 1px solid var(--edra-border);
		letter-spacing: 0.1em;
		color: var(--edra-mute);
		background-color: var(--edra-canvas-soft-2);
		border-radius: var(--edra-radius-xs);
		padding-top: 2px;
		padding-bottom: 2px;
	}
</style>
