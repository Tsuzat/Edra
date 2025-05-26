<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon-star';
	import Github from '@lucide/svelte/icons/github';
	import Coffee from '@lucide/svelte/icons/coffee';
	import { toggleMode } from 'mode-watcher';
	import AppLogo from '$lib/assets/app_logo.png';
</script>

<header
	class="bg-background/50 sticky top-0 flex items-center justify-between border-b border-dashed p-4 backdrop-blur-lg"
>
	<a class="flex items-center gap-2" href="/">
		<img src={AppLogo} alt="Edra logo" class="size-8" />
		<span class="hidden text-xl font-bold sm:block">Edra</span>
	</a>
	<div class="flex items-center gap-2 sm:gap-4">
		<Button variant="link" class="text-muted-foreground w-fit p-0" href="/examples">Examples</Button
		>
		<Button variant="link" class="text-muted-foreground w-fit p-0" href="/docs">Docs</Button>
		<Button href="https://buymeacoffee.com/tsuzat" target="_blank" variant="outline" size="icon">
			<Coffee />
		</Button>
		<Button href="https://github.com/Tsuzat/Edra" target="_blank" variant="outline" size="icon">
			<Github />
		</Button>
		<Button variant="outline" class="relative" size="icon" onclick={toggleMode}>
			<Sun class="absolute scale-100 transition-all duration-1000 dark:scale-0" />
			<Moon class="absolute scale-0 transition-all duration-1000 dark:scale-100" />
		</Button>
	</div>
</header>
