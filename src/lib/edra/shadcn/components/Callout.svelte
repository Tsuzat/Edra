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
	class={cn('my-4 flex gap-3 rounded-lg border bg-muted p-4 transition-colors dark:bg-muted/50')}
>
	<div contenteditable="false" class="mt-0.5 flex items-start select-none">
		<Popover.Root>
			<Popover.Trigger
				class={buttonVariants({ variant: 'ghost', size: 'icon', class: 'p-0! text-lg' })}
			>
				{emoji}
			</Popover.Trigger>
			<Popover.Content class="flex w-48 flex-col gap-2 shadow-lg" side="bottom" align="start">
				<div class="flex flex-col gap-1.5">
					<label for="emoji" class="text-[10px] font-bold text-muted-foreground uppercase"
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

	<div class="min-w-2 flex-1 leading-relaxed">
		<NodeViewContent class="edra-callout-content" />
	</div>
</NodeViewWrapper>
