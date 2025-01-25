<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
	import { isHttpError } from '@sveltejs/kit';
	import './docs.css';

	let { children } = $props();

	const docsHeadings = [
		{ name: 'Getting Started', isHeading: true },
		{ name: 'Introduction', isHeading: false },
		{ name: 'Installation', isHeading: false },
		{ name: 'Usage', isHeading: false },

		{ name: 'Features', isHeading: true },
		{ name: 'Placeholder', isHeading: false },
		{ name: 'Markdown Support', isHeading: false },
		{ name: 'Code Block Extended', isHeading: false },
		{ name: 'Image Extended', isHeading: false },
		{ name: 'Video Extended', isHeading: false },
		{ name: 'Table', isHeading: false },
		{ name: 'Search And Replace', isHeading: false },
		{ name: 'Links', isHeading: false },
		{ name: 'Drag Handle', isHeading: false },
		{ name: 'LaTeX Support', isHeading: false },

		{ name: 'Content Output', isHeading: true },
		{ name: 'HTML Content', isHeading: false },
		{ name: 'JSON Content', isHeading: false },
		{ name: 'Export Data', isHeading: false }
	];
</script>

<div class="flex h-full w-full">
	<div
		id="sidebar"
		class="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full flex-[25] shrink-0 px-8 md:sticky md:block"
	>
		{#each docsHeadings as heading}
			<div class="flex flex-col gap-y-2 p-2">
				{#if heading.isHeading}
					<div class="text-[1.1rem] font-bold">{heading.name}</div>
				{:else}
					<Button
						variant="link"
						data-current={$page.url.hash === `#${heading.name.replaceAll(' ', '-')}`}
						class="h-fit w-fit p-0 text-muted-foreground data-[current=true]:text-foreground data-[current=true]:underline"
						href={`#${heading.name.replaceAll(' ', '-')}`}
					>
						{heading.name}
					</Button>
				{/if}
			</div>
		{/each}
	</div>
	<div class="relative h-full w-full flex-[75]">
		{@render children()}
	</div>
</div>
