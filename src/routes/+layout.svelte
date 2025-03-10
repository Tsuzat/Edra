<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import Navbar from '$lib/components/custom/navbar.svelte';
	import '../app.css';
	import Footer from '$lib/components/custom/footer.svelte';
	import { page } from '$app/state';
	import { slide } from 'svelte/transition';
	let { children } = $props();
</script>

<ModeWatcher />

<svelte:head></svelte:head>

<div class="relative flex min-h-screen flex-col">
	<Navbar />
	{#key page.url.href}
		<div
			in:slide={{ duration: 300, delay: 300, axis: 'x' }}
			out:slide={{ duration: 300 }}
			class="animated-load size-full flex-1"
		>
			{@render children()}
		</div>
	{/key}
	<Footer />
</div>
