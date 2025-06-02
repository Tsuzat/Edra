<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '$lib/utils.js';
	import { mount, onMount } from 'svelte';
	import CopyCode from '$lib/components/custom/CopyCode.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import './page.css';
	import * as Sheet from '$lib/components/ui/sheet/index.js';

	const { children } = $props();

	interface SideBarItem {
		name: string;
		href?: string;
	}

	onMount(() => {
		const preTags = document.querySelectorAll('pre.shiki');
		preTags.forEach((tag) => {
			// Tag has code inside
			let fileName = '';
			let codeTag = tag.querySelector('code');
			if (codeTag) {
				// Code tag has a property "data-file-name" we need to get it
				fileName = codeTag.dataset.fileName || 'Terminal';
			}

			// Generate a new div
			let preTagParent = tag.parentNode;
			const div = document.createElement('div');
			div.className = 'valkyrie rounded border overflow-hidden';

			const divTopBar = document.createElement('div');
			divTopBar.className =
				'flex items-center justify-between px-4 rounded-t-md border-b border-muted-foreground/[10%] bg-muted/[25%] py-1.5 font-mono text-sm text-muted-foreground';

			// Add one div with class "file name" and content as "filename.ext"
			const fileNameDiv = document.createElement('div');
			fileNameDiv.textContent = fileName;

			mount(CopyCode, {
				target: divTopBar
			});

			divTopBar.prepend(fileNameDiv);

			if (preTagParent) {
				preTagParent.replaceChild(div, tag);
				div.prepend(divTopBar);
				div.appendChild(tag);
			}
		});

		// Add ID to all headings
		const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
		headings.forEach((heading) => {
			heading.id = (heading.textContent?.replaceAll(' ', '-') ?? '').toLowerCase();
			heading.classList.add('scroll-mt-16');
		});

		// Custome Block Quote
		const blockQuotes = document.querySelectorAll('blockquote');
		blockQuotes.forEach((blockQuote) => {
			const tagClass = blockQuote.firstChild?.textContent?.split(':')[0] || '';
			if (
				tagClass === 'Info' ||
				tagClass === 'Warning' ||
				tagClass === 'Error' ||
				tagClass === 'Note'
			) {
				if (blockQuote.firstChild !== null) blockQuote.removeChild(blockQuote.firstChild);
			}

			switch (tagClass) {
				case 'Warning':
					blockQuote.classList.add('border-l-orange-500/80', 'bg-orange-500/10', 'text-orange-500');
					break;
				case 'Error':
					blockQuote.classList.add('border-l-red-500/80', 'bg-red-500/10', 'text-red-500');
					break;
				case 'Info':
					blockQuote.classList.add('border-l-green-500/50', 'bg-green-600/10', 'text-green-500');
					break;
				case 'Note':
					blockQuote.classList.add('border-l-blue-500/50', 'bg-blue-600/10', 'text-blue-500');
					break;
				default:
					break;
			}
		});
	});

	const sideBarContent: SideBarItem[] = [
		{ name: 'Getting Started' },
		{ name: 'Introduction', href: '/docs' },
		{ name: 'Installation', href: '/docs#installation' },
		{ name: 'Usage', href: '/docs#usage' },
		{ name: 'Output' },
		{ name: 'JSON Output', href: '/docs#json-output' },
		{ name: 'HTML Output', href: '/docs#html-output' },
		{ name: 'Features' },
		{ name: 'Slash Command', href: '/docs#slash-command' },
		{ name: 'Bubble Menu', href: '/docs#bubble-menu' },
		{ name: 'Font Size', href: '/docs#font-size' },
		{ name: 'Placeholder', href: '/docs#placeholder' },
		{ name: 'Code Block Extended', href: '/docs#code-block-extended' },
		{ name: 'Image Extended', href: '/docs#image-extended' },
		{ name: 'Video Extended', href: '/docs#video-extended' },
		{ name: 'Audio Extended', href: '/docs#audio-extended' },
		{ name: 'IFrame Extended', href: '/docs#iframe-extended' },
		{ name: 'Table', href: '/docs#table' },
		{ name: 'Search And Replace', href: '/docs#search-and-replace' },
		{ name: 'Links', href: '/docs#Links' },
		{ name: 'Drag Handle', href: '/docs#drag-handle' },
		{ name: 'Drag Handle Advanced', href: '/docs#drag-handle-advanced' },
		{ name: 'LaTeX Support', href: '/docs#latex-support' },
		{ name: 'Commands' },
		{ name: 'Regular Commands', href: '/docs#regular-commands' },
		{ name: 'Special Commands', href: '/docs#special-commands' }
	];

	import Menu from '@lucide/svelte/icons/menu';
</script>

{#snippet SideBarContent()}
	{#each sideBarContent as item (item.name)}
		{#if !item.href}
			<span class="font-semibold">{item.name}</span>
		{:else}
			{@const active = `/${page.url.href.split('/').pop()}` === item.href}
			<Button
				variant="link"
				href={item.href}
				class={cn(
					'items-start justify-start',
					item.href && 'text-muted-foreground',
					active && 'text-foreground/80 font-semibold underline'
				)}
			>
				{item.name}
			</Button>
		{/if}
	{/each}
{/snippet}

<Sheet.Root>
	<Sheet.Trigger
		class={buttonVariants({
			variant: 'outline',
			size: 'icon',
			class: 'bg-muted fixed bottom-4 left-4 inline-flex rounded-full sm:hidden'
		})}
	>
		<Menu />
	</Sheet.Trigger>
	<Sheet.Content class="overflow-auto rounded border p-4" side="left">
		{@render SideBarContent()}
	</Sheet.Content>
</Sheet.Root>

<div class="m-auto flex px-2 sm:px-8">
	<div
		class="sticky top-16 left-0 hidden h-[calc(100vh-3.5rem)] w-[30%] max-w-60 flex-col overflow-auto border-r py-2 text-sm sm:flex"
	>
		{@render SideBarContent()}
	</div>
	<div class="flex-1 overflow-auto">
		<div class="prose m-auto mt-14 max-w-3xl space-y-8">
			{@render children()}
		</div>
	</div>
</div>
