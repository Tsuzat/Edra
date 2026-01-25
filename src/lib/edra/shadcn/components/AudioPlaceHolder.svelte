<script lang="ts">
	import type { NodeViewProps } from '@tiptap/core';

	const { editor }: NodeViewProps = $props();

	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Loader } from '@lucide/svelte';
	import Audio from '@lucide/svelte/icons/audio-lines';
	import { NodeViewWrapper } from 'svelte-tiptap';
	import { FileType } from '../../utils.js';
	import { toast } from 'svelte-sonner';

	let open = $state(false);
	let audioUrl = $state('');
	let isUploading = $state(false);

	function handleSubmit(e: Event) {
		e.preventDefault();
		open = false;
		editor.chain().focus().setAudio(audioUrl).run();
	}

	/**
	 * Put your own implementation of the local file getter.
	 */
	async function openFileDialog() {
		isUploading = true;
		try {
			const file = await editor.storage.fileDrop.localFileGetter(FileType.AUDIO);
			if (file) {
				editor.chain().focus().setAudio(file).run();
			}
		} catch (e) {
			isUploading = true;
			try {
				const file = await editor.storage.fileDrop.localFileGetter(FileType.AUDIO);
				if (file) {
					editor.chain().focus().setAudio(file).run();
				}
			} catch (e) {
				console.error(e);
				toast.error('Could not process audio files.');
			} finally {
				isUploading = false;
			}
		}
	}
</script>

<NodeViewWrapper
	as="div"
	contenteditable="false"
	class={buttonVariants({
		variant: 'secondary',
		class: 'media-placeholder relative my-4! w-full justify-start p-6'
	})}
	style="user-select: none;"
	draggable={true}
	onclick={() => {
		open = true;
	}}
>
	{#if isUploading}
		<Loader class="text-primary animate-spin" />
		<span>Uploading Audio File</span>
	{:else}
		<Audio />
		<span>Insert an audio</span>
	{/if}
	<Popover.Root bind:open>
		<Popover.Trigger class="sr-only absolute left-1/2">Open</Popover.Trigger>
		<Popover.Content
			onCloseAutoFocus={(e) => e.preventDefault()}
			contenteditable={false}
			class="bg-popover w-96 rounded-lg p-0 transition-all duration-500"
			portalProps={{ disabled: true, to: undefined }}
		>
			<Tabs.Root value="local">
				<Tabs.List>
					<Tabs.Trigger value="local">Upload</Tabs.Trigger>
					<Tabs.Trigger value="url">Embed Link</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="local" class="py-2">
					<Button class="w-full" onclick={openFileDialog}>Upload an Audio</Button>
				</Tabs.Content>
				<Tabs.Content value="url" class="py-2">
					<form onsubmit={handleSubmit} class="flex flex-col gap-2">
						<Input placeholder="Embed Audio" bind:value={audioUrl} required type="url" />
						<Button type="submit">Insert</Button>
					</form>
				</Tabs.Content>
			</Tabs.Root>
		</Popover.Content>
	</Popover.Root>
</NodeViewWrapper>
