<script lang="ts">
	import { Quote } from 'lucide-svelte';
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
				class={cn('size-8', editor.isActive('blockquote') && 'bg-muted')}
				onclick={() => editor.chain().focus().toggleBlockquote().run()}
			>
				<Quote />
			</Button>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Block Quote (⌘⇧B)</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
