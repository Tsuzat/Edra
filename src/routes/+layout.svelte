<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import Navbar from '$lib/components/custom/Navbar.svelte';
	import Footer from '$lib/components/custom/Footer.svelte';
	import Deprecated from '$lib/components/custom/Deprecated.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<title>Shad Editor - A beautiful editor for svelte developers</title>
</svelte:head>

<ModeWatcher />

<main class="flex min-h-screen flex-col">
	<Deprecated />
	<Navbar />
	<div class="h-full w-full flex-1">
		{@render children()}
	</div>
	<Footer />
</main>
