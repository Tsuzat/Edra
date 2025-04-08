<script lang="ts">
	import Coffee from 'lucide-svelte/icons/coffee';
	import GitHub from 'lucide-svelte/icons/github';
	import { Button } from '$lib/components/ui/button/index.js';
	import ThemeToggler from './theme-toggler.svelte';
</script>

<nav
	class="sticky top-0 z-50 inline-flex w-full items-center justify-between border-b border-border/75 bg-background/75 px-4 py-2 backdrop-blur"
>
	<a class="inline-flex items-center gap-2" href="/">
		<img src="/favicon.png" alt="Edra logo" class="size-8" />
		<span class="hidden text-xl font-bold sm:block">Edra</span>
	</a>
	<div class="inline-flex items-center gap-2">
		<Button variant="link" class="w-fit p-1 text-muted-foreground" href="/examples">Examples</Button
		>
		<Button variant="link" class="w-fit p-1 text-muted-foreground" href="/docs">Docs</Button>
		<Button variant="outline" size="icon" href="https://buymeacoffee.com/tsuzat" target="_blank">
			<Coffee />
		</Button>
		<Button variant="outline" size="icon" href="https://github.com/Tsuzat/Edra" target="_blank">
			<GitHub />
		</Button>
		<ThemeToggler />
	</div>
</nav>
