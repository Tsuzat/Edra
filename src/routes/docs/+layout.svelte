<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '$lib/utils.js';
	import { mount, onMount } from 'svelte';
	import CopyCode from '$lib/components/custom/copy-code.svelte';
	import './docs.css';
	import { Button } from '$lib/components/ui/button/index.js';

	const { children } = $props();

	interface SideBarItem {
		name: string;
		href?: string;
	}

	onMount(() => {
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
				div.className = 'valkyrie rounded overflow-hidden';

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
				heading.id = heading.textContent?.replaceAll(' ', '-') ?? '';
				heading.classList.add('scroll-mt-16');
			});

			// Custome Block Quote
			const blockQuotes = document.querySelectorAll('blockquote');
			blockQuotes.forEach((blockQuote) => {
				const tagClass = blockQuote.firstChild?.textContent?.split(':')[0] || '';
				if (tagClass === 'Info' || tagClass === 'Warning' || tagClass === 'Error') {
					if (blockQuote.firstChild !== null) blockQuote.removeChild(blockQuote.firstChild);
				}

				switch (tagClass) {
					case 'Warning':
						blockQuote.classList.add(
							'border-l-orange-500/80',
							'bg-orange-500/10',
							'text-orange-500'
						);
						break;
					case 'Error':
						blockQuote.classList.add('border-l-red-500/80', 'bg-red-500/10', 'text-red-500');
						break;
					case 'Info':
						blockQuote.classList.add('border-l-green-500/50', 'bg-green-600/10', 'text-green-500');
						break;
					default:
						break;
				}
			});
		});
	});

	const sideBarContent: SideBarItem[] = [
		{
			name: 'Getting Started'
		},
		{
			name: 'Introduction',
			href: '/docs'
		},
		{
			name: 'Installation',
			href: '/docs#Installation'
		},
		{
			name: 'Usage',
			href: '/docs#Usage'
		},
		{
			name: 'Output'
		},
		{
			name: 'JSON Output',
			href: '/docs#JSON-Output'
		},
		{
			name: 'HTML Output',
			href: '/docs#HTML-Output'
		},
		{
			name: 'Features'
		}
	];
</script>

<div class="m-auto flex px-2 sm:px-8">
	<div class="sticky top-14 flex size-full w-80 flex-col gap-4 overflow-auto border-r pt-4 text-sm">
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
						active && 'font-semibold text-foreground/80 underline'
					)}
				>
					{item.name}
				</Button>
			{/if}
		{/each}
	</div>
	<div class="flex-1 overflow-auto">
		<div class="prose m-auto dark:prose-invert *:my-2 sm:min-w-[70%]">
			{@render children()}
		</div>
	</div>
</div>
