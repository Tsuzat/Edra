<script lang="ts">
	import { Image } from 'lucide-svelte';
	import { type Editor } from '@tiptap/core';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';

	let { editor }: { editor: Editor } = $props();
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Button
				variant="ghost"
				class={cn('h-8', editor.isActive('image-placeholder') && 'bg-muted')}
				onclick={() => editor.chain().focus().insertImagePlaceholder().run()}
			>
				<Image />
			</Button>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Add Image</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
