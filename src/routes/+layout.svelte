<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import Navbar from '$lib/components/custom/navbar.svelte';
	import '../app.css';
	import Footer from '$lib/components/custom/footer.svelte';
	import { page } from '$app/state';
	import { slide } from 'svelte/transition';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import ScrollToTop from '$lib/components/custom/scroll-to-top.svelte';
	let { children } = $props();
</script>

<ModeWatcher />
<Toaster richColors />

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
	<ScrollToTop />
</div>
