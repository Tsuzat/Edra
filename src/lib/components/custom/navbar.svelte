<script lang="ts">
	import Coffee from 'lucide-svelte/icons/coffee';
	import GitHub from 'lucide-svelte/icons/github';
	import { Button } from '$lib/components/ui/button/index.js';
	import ThemeToggler from './theme-toggler.svelte';
</script>

<nav class="inline-flex w-full items-center justify-between gap-4 border-b border-border px-4 py-2">
	<div class="inline-flex items-center gap-2">
		<img src="/favicon.png" alt="logo" class="size-8" />
		<span class="text-xl font-bold">Edra</span>
	</div>
	<div>
		<Button variant="link" href="/docs">Docs</Button>
		<Button variant="outline" size="icon" href="https://buymeacoffee.com/tsuzat" target="_blank">
			<Coffee />
		</Button>
		<Button variant="outline" size="icon" href="https://github.com/Tsuzat/Edra" target="_blank">
			<GitHub />
		</Button>
		<ThemeToggler />
	</div>
</nav>
