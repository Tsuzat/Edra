<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import Navbar from '$lib/components/custom/Navbar.svelte';
	import Footer from '$lib/components/custom/Footer.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<title>Shad Editor</title>
</svelte:head>

<ModeWatcher />

<main class="flex min-h-screen flex-col">
	<Navbar />
	<div class="h-full w-full flex-1">
		{@render children()}
	</div>
	<Footer />
</main>
