<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { NodeViewWrapper } from '$lib/edra/tiptap/index.js';
	import { AudioLines, Video, Image, CodeXml } from '@lucide/svelte';
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
			case 'iframe':
				return {
					icon: CodeXml,
					text: 'Insert An IFrame'
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
		} else if (mediaType === 'iframe') {
			editor.chain().focus().setIframe({ src }).run();
		}
	}
</script>

<NodeViewWrapper class="my-2 w-full!">
	{@const Icon = mediaTypeData?.icon}
	{@const text = mediaTypeData?.text}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		role="button"
		tabindex={1}
		class="flex min-h-14 w-full items-center gap-2 rounded-lg border border-dashed bg-muted/30 p-4 transition-colors hover:bg-muted/50"
		onclick={() => (open = true)}
	>
		<Icon class="size-4 text-muted-foreground" />
		<span class="text-sm text-muted-foreground" contenteditable={false}>{text}</span>

		<Popover.Root bind:open>
			<Popover.Trigger class="sr-only left-1/2"></Popover.Trigger>
			<Popover.Content portalProps={{ to: undefined }}>
				<Tabs.Root value="link" class="w-full">
					<Tabs.List>
						<Tabs.Trigger value="link">Link</Tabs.Trigger>
						{#if mediaType !== 'iframe'}
							<Tabs.Trigger value="file">File</Tabs.Trigger>
						{/if}
					</Tabs.List>
					<Tabs.Content value="link">
						<form class="flex flex-col gap-2">
							<Input type="url" bind:value={url} />
							<Button type="submit" class="capitalize" onclick={() => setMediaFn(url)}
								>Insert {mediaType}</Button
							>
						</form>
					</Tabs.Content>
					{#if mediaType !== 'iframe'}
						<Tabs.Content value="file">
							<form class="flex flex-col gap-2" onsubmit={handleFileSubmit}>
								<Input type="file" bind:files />
								<Button type="submit" class="capitalize">Insert {mediaType}</Button>
							</form>
						</Tabs.Content>
					{/if}
				</Tabs.Root>
			</Popover.Content>
		</Popover.Root>
	</div>
</NodeViewWrapper>
