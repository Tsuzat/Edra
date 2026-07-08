<script lang="ts">
	import { NodeViewContent, NodeViewWrapper, type NodeViewProps } from '$lib/edra/tiptap/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';

	const { node, updateAttributes }: NodeViewProps = $props();

	let emoji = $derived(node.attrs.emoji ?? '💡');

	function handleEmojiInput(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.value) {
			const emojiChar = Array.from(target.value)[0] || '💡';
			updateAttributes({ emoji: emojiChar });
		}
	}
</script>

<NodeViewWrapper
	class={cn('my-4 flex gap-3 p-4 dark:bg-muted/50 bg-muted rounded-lg border transition-colors')}
>
	<div contenteditable="false" class="select-none flex items-start mt-0.5">
		<Popover.Root>
			<Popover.Trigger
				class={buttonVariants({ variant: 'ghost', size: 'icon', class: 'p-0! text-lg' })}
			>
				{emoji}
			</Popover.Trigger>
			<Popover.Content class="w-48 flex flex-col gap-2 shadow-lg" side="bottom" align="start">
				<div class="flex flex-col gap-1.5">
					<label for="emoji" class="text-[10px] uppercase font-bold text-muted-foreground"
						>Emoji Icon</label
					>
					<Input
						id="emoji"
						value={emoji}
						oninput={handleEmojiInput}
						placeholder="Paste or type an emoji..."
						class="h-8 text-sm"
						maxlength={10}
					/>
				</div>
			</Popover.Content>
		</Popover.Root>
	</div>

	<div class="flex-1 min-w-2 leading-relaxed">
		<NodeViewContent class="edra-callout-content" />
	</div>
</NodeViewWrapper>
