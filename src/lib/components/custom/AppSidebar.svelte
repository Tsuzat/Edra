<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

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
					}
				]
			}
		]
	};
</script>

<Sidebar.Root {...restProps} bind:ref>
	<Sidebar.Header class="mt-2">
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton>
					{#snippet child({ props })}
						<a href={resolve('/')} {...props}>
							<img src="/favicon.svg" alt="Edra" class="size-8" />
							<span class="font-semibold text-xl">Edra</span>
						</a>
					{/snippet}
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
							<Sidebar.MenuItem class="my-1">
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
