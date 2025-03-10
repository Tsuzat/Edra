<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import Navbar from '$lib/components/custom/navbar.svelte';
	import '../app.css';
	import Footer from '$lib/components/custom/footer.svelte';
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';
	let { children } = $props();
</script>

<ModeWatcher />

<svelte:head></svelte:head>

{#key page.url}
	<div
		in:fade={{ duration: 300, delay: 400 }}
		out:fade={{ duration: 300 }}
		class="relative flex min-h-screen flex-col"
	>
		<Navbar />
		{@render children()}
		<Footer />
	</div>
{/key}
