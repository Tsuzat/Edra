<script lang="ts">
	import AppSidebar from '$lib/components/custom/AppSidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import ToggleMode from '$lib/components/custom/ToggleMode.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import './layout.css';

	let { children } = $props();
</script>

<Sidebar.Provider class="[&_a]:no-underline!">
	<AppSidebar variant="sidebar" />
	<Sidebar.Inset>
		<header
			class="flex h-16 sticky top-0 shrink-0 items-center justify-between gap-2 px-4 border-b bg-background/95 backdrop-blur"
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
		<main class="flex-1 overflow-y-auto p-6 md:p-10 max-w-4xl mx-auto w-full">
			{@render children()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
