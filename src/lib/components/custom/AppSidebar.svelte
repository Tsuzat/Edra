<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { getKeyboardShortcut } from '$lib/edra/utils.js';
	import { ArrowLeft, Search } from '@lucide/svelte';
	import { openSearch } from './docs/Search.svelte';
	import { Button } from '../ui/button/index.ts';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();

	const data = {
		navMain: [
			{
				title: 'Getting Started',
				items: [
					{
						title: 'Introduction',
						url: resolve('/docs')
					},
					{
						title: 'Installation',
						url: resolve('/docs/installation')
					},
					{
						title: 'Configuration',
						url: resolve('/docs/configuration')
					},
					{
						title: 'Usages',
						url: resolve('/docs/usages')
					},
					{
						title: 'Data & Serialization',
						url: resolve('/docs/usages/serialization')
					}
				]
			},
			{
				title: 'Extensions & Plugins',
				items: [
					{
						title: 'Starter Kit',
						url: resolve('/docs/extensions/starter-kit')
					},
					{
						title: 'Tables',
						url: resolve('/docs/extensions/tables')
					},
					{
						title: 'Task List',
						url: resolve('/docs/extensions/tasks')
					},
					{
						title: 'Table of Contents',
						url: resolve('/docs/extensions/table-of-contents')
					},
					{
						title: 'Typography & Colors',
						url: resolve('/docs/extensions/typography-and-colors')
					},
					{
						title: 'Mathematics',
						url: resolve('/docs/extensions/mathematics')
					},
					{
						title: 'Markdown',
						url: resolve('/docs/extensions/markdown')
					},
					{
						title: 'Media & Mermaid',
						url: resolve('/docs/extensions/media-and-mermaid')
					},
					{
						title: 'Callouts',
						url: resolve('/docs/extensions/callout')
					},
					{
						title: 'Drag Handle',
						url: resolve('/docs/extensions/drag-handle')
					},
					{
						title: 'Codeblock',
						url: resolve('/docs/extensions/code-block')
					},
					{
						title: 'AI Assistant',
						url: resolve('/docs/extensions/ai')
					},
					{
						title: 'Slash Command',
						url: resolve('/docs/extensions/slash-command')
					}
				]
			},
			{
				title: 'Customization',
				items: [
					{
						title: 'Customizing Extensions',
						url: resolve('/docs/customization')
					},
					{
						title: 'Typography & Styling',
						url: resolve('/docs/customization/styling')
					},
					{
						title: 'Localization & Strings',
						url: resolve('/docs/customization/localization')
					}
				]
			}
		]
	};
</script>

<Sidebar.Root {...restProps} bind:ref>
	<Sidebar.Header class="mt-2">
		<Button variant="ghost" class="nodefault justify-start" href={resolve('/')}>
			<ArrowLeft />
			<span>Edra</span>
		</Button>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton class="border rounded-lg" onclick={openSearch}>
					<Search />
					<span>Search Document</span>
					<span class="bg-muted ml-auto text-sm px-1 rounded">{getKeyboardShortcut('K', true)}</span
					>
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		{#each data.navMain as group (group.title)}
			<Sidebar.Group>
				<Sidebar.GroupLabel>{group.title}</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each group.items as item (item.title)}
							<Sidebar.MenuItem class="my-0.5">
								{@const isActive = page.url.pathname === item.url}
								<Sidebar.MenuButton {isActive}>
									{#snippet child({ props })}
										<a href={item.url} {...props}>{item.title}</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
	</Sidebar.Content>
	<Sidebar.Rail />
</Sidebar.Root>
