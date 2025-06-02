<script lang="ts">
	import Footer from '$lib/components/custom/Footer.svelte';
	import Header from '$lib/components/custom/Header.svelte';
	import '@fontsource-variable/open-sans';
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from 'svelte-sonner';

	let { children } = $props();
</script>

<ModeWatcher />
<Toaster closeButton richColors />

<Header />
{@render children()}
<Footer />
