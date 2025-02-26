<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '@fontsource/poppins';
	// import '../app.css';
	let { children } = $props();
</script>

<ModeWatcher />

{@render children()}
