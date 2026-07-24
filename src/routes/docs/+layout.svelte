<script lang="ts">
	import AppSidebar from '$lib/components/custom/AppSidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import ToggleMode from '$lib/components/custom/ToggleMode.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import './layout.css';

	import { initPackageManager } from '$lib/edra/docs/packageManager.svelte.js';

	let { children } = $props();

	initPackageManager();
</script>

<Sidebar.Provider class="[&_a]:no-underline!">
	<AppSidebar variant="sidebar" />
	<Sidebar.Inset>
		<header
			class="sticky top-0 z-10! flex h-14 shrink-0 items-center justify-between gap-2 bg-background/80 px-4 backdrop-blur-xl"
		>
			<div class="flex items-center gap-2">
				<Sidebar.Trigger class="-ml-1" />
				<span class="text-sm font-medium text-muted-foreground">Documentation</span>
			</div>
			<div class="flex items-center gap-4">
				<Button variant="ghost" class="text-sm font-medium" href="/">Back to Home</Button>
				<ToggleMode />
			</div>
		</header>
		<main class="mx-auto w-full max-w-4xl flex-1 overflow-y-auto p-6 md:p-10">
			{@render children()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
