<script lang="ts">
	import { page } from '$app/stores';
	import logo from '$lib/static/logo.png';
	import Button from '../ui/button/button.svelte';
	import Icons from './icons/index.js';
	import ToggleTheme from './ToggleTheme.svelte';
</script>

<nav class="flex items-center justify-between border-b p-2 sm:p-4">
	<a href="/" id="logo" class="group flex items-center gap-2">
		<img src={logo} alt="shadeditor logo" class="size-6" />
		<span class="hidden text-lg font-bold sm:block">Shad Editor</span>
	</a>
	<div class="flex items-center gap-2">
		<a href="/docs" class="text-muted-foreground data-[current=true]:text-foreground">Docs</a>
		<Button
			variant="outline"
			size="icon"
			class="size-8"
			href="https://buymeacoffee.com/tsuzat"
			target="_blank"
		>
			<Icons.coffee />
		</Button>
		<Button
			variant="outline"
			size="icon"
			class="size-8"
			href="https://github.com/Tsuzat/ShadEditor"
			target="_blank"
		>
			<Icons.github />
		</Button>
		<Button
			variant="outline"
			size="icon"
			class="size-8"
			href="https://x.com/TheTsuzat"
			target="_blank"
		>
			<Icons.x />
		</Button>
		<ToggleTheme />
	</div>
</nav>
