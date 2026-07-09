<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import './layout.css';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { TooltipProvider } from '$lib/components/ui/tooltip/index.js';

	const { children } = $props();
</script>

<ModeWatcher />
<Toaster richColors closeButton />

<TooltipProvider>
	{@render children()}
</TooltipProvider>
