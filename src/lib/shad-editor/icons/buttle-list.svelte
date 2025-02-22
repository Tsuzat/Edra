<script lang="ts">
	import { List } from 'lucide-svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import type { ToolBarIconProps } from './types.js';

	let { editor, toolTipProps = { delayDuration: 0, disabled: false } }: ToolBarIconProps = $props();
</script>

<Tooltip.Provider {...toolTipProps}>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Button
				variant="ghost"
				size="icon"
				class={cn('size-8', editor.isActive('bulletList') && 'bg-muted')}
				onclick={() => editor.chain().focus().toggleBulletList().run()}
			>
				<List />
			</Button>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Bullet List (⌘⇧8)</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
