<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { NodeViewWrapper } from '$lib/edra/tiptap/index.js';
	import { AudioLines, Video, Image } from '@lucide/svelte';
	import { type NodeViewProps } from '@tiptap/core';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	const { editor, node }: NodeViewProps = $props();
	let open = $state(false);
	const mediaType = $derived(node.attrs.mediaType);
	let url = $state('');
	let files = $state<FileList | undefined>();

	function handleFileSubmit(e: SubmitEvent) {
		e.preventDefault();
		const file = files?.[0];
		if (file) {
			editor.commands.uploadMedia(file);
			open = false;
		}
	}

	const mediaTypeData = $derived.by(() => {
		switch (mediaType) {
			case 'audio':
				return {
					icon: AudioLines,
					text: 'Insert An Audio File'
				};
			case 'video':
				return {
					icon: Video,
					text: 'Insert An Video File'
				};
			case 'image':
				return {
					icon: Image,
					text: 'Insert An Image File'
				};
		}
	});

	function setMediaFn(src: string) {
		if (mediaType === 'audio') {
			editor.chain().focus().setAudio({ src }).run();
		} else if (mediaType === 'video') {
			editor.chain().focus().setVideo({ src }).run();
		} else if (mediaType === 'image') {
			editor.chain().focus().setImage({ src }).run();
		}
	}
</script>

<NodeViewWrapper class="my-2 w-full!">
	{@const Icon = mediaTypeData?.icon}
	{@const text = mediaTypeData?.text}
	<Popover.Root bind:open>
		<Popover.Trigger
			class={buttonVariants({ variant: 'secondary', class: 'w-full! h-12 justify-start' })}
		>
			<Icon />
			<span>{text}</span>
		</Popover.Trigger>
		<Popover.Content>
			<Tabs.Root value="link" class="w-full">
				<Tabs.List>
					<Tabs.Trigger value="link">Link</Tabs.Trigger>
					<Tabs.Trigger value="file">File</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="link">
					<form class="flex flex-col gap-2">
						<Input type="url" bind:value={url} />
						<Button type="submit" class="capitalize" onclick={() => setMediaFn(url)}
							>Insert {mediaType}</Button
						>
					</form>
				</Tabs.Content>
				<Tabs.Content value="file">
					<form class="flex flex-col gap-2" onsubmit={handleFileSubmit}>
						<Input type="file" bind:files />
						<Button type="submit" class="capitalize">Insert {mediaType}</Button>
					</form>
				</Tabs.Content>
			</Tabs.Root>
		</Popover.Content>
	</Popover.Root>
</NodeViewWrapper>
