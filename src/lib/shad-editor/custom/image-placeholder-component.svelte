<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import type { NodeViewProps } from '@tiptap/core';
	import { ImageIcon, X } from 'lucide-svelte';
	import { NodeViewWrapper } from 'svelte-tiptap';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	const { node, editor, selected, deleteNode, updateAttributes }: NodeViewProps = $props();
</script>

<NodeViewWrapper class="w-full">
	<Popover.Root>
		<Popover.Trigger
			class={buttonVariants({
				variant: 'outline',
				class: 'w-full items-center justify-start bg-muted/50 py-6'
			})}
		>
			<ImageIcon />
			<span>Add an Image</span>
		</Popover.Trigger>
		<Popover.Content class="bg-popover shadow-lg *:my-2">
			<div class="flex items-center justify-between">
				<h1 class="text-xl font-bold">Image</h1>
				<Popover.Close>
					<X class="size-4 text-muted-foreground" />
				</Popover.Close>
			</div>
			<p>Insert image url</p>
			<Input
				placeholder="Enter image url..."
				type="url"
				onchange={(e) => {
					if (e !== null && e.target !== null) {
						//@ts-ignore
						editor.chain().focus().setImage({ src: e.target.value }).run();
					}
				}}
				class="w-full"
			/>
			<p class="font-bold">OR</p>
			<p>Pick an Image</p>
			<Input
				id="picture"
				type="file"
				accept="image/*"
				multiple={false}
				onchange={(e: Event) => {
					//@ts-ignore
					if (e.target && e.target.files) {
						//@ts-ignore
						const files = Array.from(e.target.files || []);
						files.map((file) => {
							const reader = new FileReader();
							reader.onload = () => {
								const src = reader.result as string;
								editor.chain().focus().setImage({ src }).run();
							};
							//@ts-ignore
							reader.readAsDataURL(file);
						});
					}
				}}
			/>
		</Popover.Content>
	</Popover.Root>
</NodeViewWrapper>
