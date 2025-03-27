<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon-star';
	import { mode, toggleMode } from 'mode-watcher';
</script>

<Button variant="outline" size="icon" class="theme-toggler" onclick={toggleMode}>
	{#if $mode === 'dark'}
		<Moon />
	{:else}
		<Sun />
	{/if}
	<span class="sr-only">Toggle theme</span>
</Button>
