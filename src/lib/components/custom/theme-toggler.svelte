<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon-star';
	import { cn } from '$lib/utils.js';
	import { mode, toggleMode } from 'mode-watcher';
</script>

<Button variant="outline" size="icon" class="theme-toggler" onclick={toggleMode}>
	<Sun class={cn($mode === 'dark' ? 'hidden' : '')} />
	<Moon class={cn($mode === 'light' ? 'hidden' : '')} />
	<span class="sr-only">Toggle theme</span>
</Button>
