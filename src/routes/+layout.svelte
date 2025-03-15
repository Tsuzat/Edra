<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import Navbar from '$lib/components/custom/navbar.svelte';
	import '../app.css';
	import Footer from '$lib/components/custom/footer.svelte';
	import { page } from '$app/state';
	import { slide } from 'svelte/transition';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	let { children } = $props();
</script>

<ModeWatcher />
<Toaster richColors />

<svelte:head></svelte:head>

<div class="relative flex min-h-screen flex-col">
	<Navbar />
	{#key page.url.pathname}
		<div
			in:slide={{ duration: 300, delay: 300, axis: 'x' }}
			out:slide={{ duration: 300 }}
			class="animated-load size-full flex-1 flex-grow"
		>
			{@render children()}
		</div>
	{/key}
	<Footer />
</div>
