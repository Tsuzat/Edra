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
		{ name: 'LaTeX Support', href: '/docs#latex-support' },
		{ name: 'Commands' },
		{ name: 'Regular Commands', href: '/docs#regular-commands' },
		{ name: 'Special Commands', href: '/docs#special-commands' }
	];
</script>

<div class="m-auto flex px-2 sm:px-8">
	<div
		class="sticky left-0 top-14 hidden max-h-screen w-[30%] max-w-60 flex-col gap-2 overflow-auto border-r py-4 text-sm sm:flex"
	>
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
