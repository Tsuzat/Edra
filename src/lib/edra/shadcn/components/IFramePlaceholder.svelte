<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import type { NodeViewProps } from '@tiptap/core';
	import { NodeViewWrapper } from 'svelte-tiptap';
	import CodeXml from 'lucide-svelte/icons/code-xml';
	const { editor }: NodeViewProps = $props();
	import * as Popover from '$lib/components/ui/popover/index.js';
	import X from 'lucide-svelte/icons/x';
	import { Input } from '$lib/components/ui/input/index.js';

	let src = $state<string>('');
</script>

<NodeViewWrapper class="my-2 w-full" contenteditable={false} spellcheck={false}>
	<Popover.Root>
		<Popover.Trigger
			class={buttonVariants({
				variant: 'outline',
				class: 'h-fit w-full bg-muted/50 p-0'
			})}
		>
			<div contenteditable="false" class="flex w-full items-center justify-start p-4">
				<CodeXml class="mr-2" />
				<span>Insert an IFrame</span>
			</div>
		</Popover.Trigger>
		<Popover.Content class="relative bg-popover shadow-lg *:my-2">
			<p>Insert ifram url</p>
			<Input placeholder="Enter iframe src url..." type="url" bind:value={src} class="w-full" />
			{#if src.trim() !== ''}
				<iframe {src} title="IFrame" class="aspect-video w-full"> </iframe>
				<Button onclick={() => editor.chain().focus().setIframe({ src }).run()}>Add IFrame</Button>
			{/if}
		</Popover.Content>
	</Popover.Root>
</NodeViewWrapper>
