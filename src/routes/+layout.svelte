<script lang="ts">
	import Footer from '$lib/components/custom/Footer.svelte';
	import Header from '$lib/components/custom/Header.svelte';
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<ModeWatcher />

<Header />
{@render children()}
<Footer />
