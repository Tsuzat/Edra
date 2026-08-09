<script lang="ts">
	import { getPackageManager, type PackageManager } from '$lib/edra/docs/packageManager.svelte.js';
	import Code from './Code.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';

	interface Props {
		type: 'headless' | 'shadcn' | 'registry' | 'template-ai' | 'template-notion' | 'collaboration';
	}

	const { type }: Props = $props();

	const state = getPackageManager();

	const commands: Record<Props['type'], Record<PackageManager, string>> = {
		headless: {
			npm: 'npx edra@latest init headless',
			pnpm: 'pnpm dlx edra@latest init headless',
			yarn: 'yarn dlx edra@latest init headless',
			bun: 'bunx edra@latest init headless'
		},
		shadcn: {
			npm: 'npx edra@latest init shadcn',
			pnpm: 'pnpm dlx edra@latest init shadcn',
			yarn: 'yarn dlx edra@latest init shadcn',
			bun: 'bunx edra@latest init shadcn'
		},
		registry: {
			npm: 'npx shadcn-svelte@latest add https://edra.tsuzat.com/r/edra.json',
			pnpm: 'pnpm dlx shadcn-svelte@latest add https://edra.tsuzat.com/r/edra.json',
			yarn: 'yarn dlx shadcn-svelte@latest add https://edra.tsuzat.com/r/edra.json',
			bun: 'bunx shadcn-svelte@latest add https://edra.tsuzat.com/r/edra.json'
		},
		'template-ai': {
			npm: 'npx shadcn-svelte@latest add https://edra.tsuzat.com/r/template-ai.json',
			pnpm: 'pnpm dlx shadcn-svelte@latest add https://edra.tsuzat.com/r/template-ai.json',
			yarn: 'yarn dlx shadcn-svelte@latest add https://edra.tsuzat.com/r/template-ai.json',
			bun: 'bunx shadcn-svelte@latest add https://edra.tsuzat.com/r/template-ai.json'
		},
		'template-notion': {
			npm: 'npx shadcn-svelte@latest add https://edra.tsuzat.com/r/template-notion.json',
			pnpm: 'pnpm dlx shadcn-svelte@latest add https://edra.tsuzat.com/r/template-notion.json',
			yarn: 'yarn dlx shadcn-svelte@latest add https://edra.tsuzat.com/r/template-notion.json',
			bun: 'bunx shadcn-svelte@latest add https://edra.tsuzat.com/r/template-notion.json'
		},
		collaboration: {
			npm: 'npm install @hocuspocus/provider @hocuspocus/server yjs @tiptap/extension-collaboration @tiptap/extension-collaboration-caret',
			pnpm: 'pnpm add @hocuspocus/provider @hocuspocus/server yjs @tiptap/extension-collaboration @tiptap/extension-collaboration-caret',
			yarn: 'yarn add @hocuspocus/provider @hocuspocus/server yjs @tiptap/extension-collaboration @tiptap/extension-collaboration-caret',
			bun: 'bun add @hocuspocus/provider @hocuspocus/server yjs @tiptap/extension-collaboration @tiptap/extension-collaboration-caret'
		}
	};

	const managers: { value: PackageManager; label: string }[] = [
		{ value: 'npm', label: 'npm' },
		{ value: 'pnpm', label: 'pnpm' },
		{ value: 'yarn', label: 'yarn' },
		{ value: 'bun', label: 'bun' }
	];
</script>

<div>
	<div class="flex items-center gap-1">
		<Tabs.Root bind:value={state.value}>
			<Tabs.List>
				{#each managers as mgr, idx (idx)}
					<Tabs.Trigger value={mgr.value}>
						{mgr.label}
					</Tabs.Trigger>
				{/each}
			</Tabs.List>
		</Tabs.Root>
	</div>
	{#key state.value}
		<Code code={commands[type][state.value]} language="shell" />
	{/key}
</div>
