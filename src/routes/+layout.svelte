<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import './layout.css';
	import '@fontsource-variable/dm-sans';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	const { children } = $props();
</script>

<ModeWatcher />
<Toaster richColors closeButton />

{@render children()}
