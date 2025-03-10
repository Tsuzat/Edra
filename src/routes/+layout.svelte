<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import Navbar from '$lib/components/custom/navbar.svelte';
	import '../app.css';
	import Footer from '$lib/components/custom/footer.svelte';
	let { children } = $props();
</script>

<ModeWatcher />

<svelte:head></svelte:head>

<div class="relative flex min-h-screen flex-col">
	<Navbar />
	<div class="size-full flex-1">
		{@render children()}
	</div>
	<Footer />
</div>
