<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import type { NodeViewProps } from '@tiptap/core';
	import ImageIcon from 'lucide-svelte/icons/image';
	import X from 'lucide-svelte/icons/x';
	import { NodeViewWrapper } from 'svelte-tiptap';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	const { editor }: NodeViewProps = $props();
</script>

<NodeViewWrapper class="my-2 w-full">
	<Popover.Root>
		<Popover.Trigger
			class={buttonVariants({
				variant: 'outline',
				class: 'h-fit w-full bg-muted/50 p-0'
			})}
		>
			<div contenteditable="false" class="flex w-full items-center justify-start p-4">
				<ImageIcon class="mr-2" />
				<span>Add an Image</span>
			</div>
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
