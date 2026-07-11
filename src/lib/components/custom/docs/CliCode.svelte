<script lang="ts">
	import { getPackageManager, type PackageManager } from '$lib/edra/docs/packageManager.svelte.js';
	import Code from './Code.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';

	interface Props {
		type: 'headless' | 'shadcn' | 'registry';
	}

	const { type }: Props = $props();

	const state = getPackageManager();

	const commands: Record<Props['type'], Record<PackageManager, string>> = {
		headless: {
			npm: 'npx edra@next init headless',
			pnpm: 'pnpm dlx edra@next init headless',
			yarn: 'yarn dlx edra@next init headless',
			bun: 'bunx edra@next init headless'
		},
		shadcn: {
			npm: 'npx edra@next init shadcn',
			pnpm: 'pnpm dlx edra@next init shadcn',
			yarn: 'yarn dlx edra@next init shadcn',
			bun: 'bunx edra@next init shadcn'
		},
		registry: {
			npm: 'npx shadcn-svelte@latest add https://edra.tsuzat.com/r/edra.json',
			pnpm: 'pnpm dlx shadcn-svelte@latest add https://edra.tsuzat.com/r/edra.json',
			yarn: 'yarn dlx shadcn-svelte@latest add https://edra.tsuzat.com/r/edra.json',
			bun: 'bunx shadcn-svelte@latest add https://edra.tsuzat.com/r/edra.json'
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
