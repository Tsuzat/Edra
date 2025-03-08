<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '@fontsource/poppins';
	import Navbar from '$lib/components/custom/navbar.svelte';
	import '../app.css';
	let { children } = $props();
</script>

<ModeWatcher />

<svelte:head></svelte:head>

<div class="flex h-screen w-screen flex-col">
	<Navbar />
	{@render children()}
</div>
