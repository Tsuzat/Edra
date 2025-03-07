<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import type { NodeViewProps } from '@tiptap/core';
	import AudioLines from 'lucide-svelte/icons/audio-lines';
	import X from 'lucide-svelte/icons/x';
	import { NodeViewWrapper } from 'svelte-tiptap';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	const { editor }: NodeViewProps = $props();

	/**
	 * Stores the audio url
	 */
	let src = $state('');
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
				<AudioLines class="mr-2" />
				<span>Insert an Audio</span>
			</div>
		</Popover.Trigger>
		<Popover.Content class="bg-popover shadow-lg *:my-2">
			<div class="flex items-center justify-between">
				<h1 class="text-xl font-bold">Audio</h1>
				<Popover.Close>
					<X class="size-4 text-muted-foreground" />
				</Popover.Close>
			</div>
			<p>Insert Audio url</p>
			<Input placeholder="Enter audio url..." type="url" bind:value={src} class="w-full" />
			<p class="font-bold">OR</p>
			<p>Pick a Audio</p>
			<Input
				id="picture"
				type="file"
				accept="audio/*"
				multiple={false}
				onchange={(e: Event) => {
					//@ts-ignore
					if (e.target && e.target.files) {
						//@ts-ignore
						const files = Array.from(e.target.files || []);
						files.map((file) => {
							const reader = new FileReader();
							reader.onload = () => {
								src = reader.result as string;
							};
							//@ts-ignore
							reader.readAsDataURL(file);
						});
					}
				}}
			/>
			{#if src.trim() !== ''}
				<audio {src} controls class="h-fit w-fit"> </audio>
				<Button onclick={() => editor.chain().focus().setAudio(src).run()}>Add Audio</Button>
			{/if}
		</Popover.Content>
	</Popover.Root>
</NodeViewWrapper>
