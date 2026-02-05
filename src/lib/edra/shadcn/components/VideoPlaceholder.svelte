<script lang="ts">
	import type { NodeViewProps } from '@tiptap/core';

	const { editor }: NodeViewProps = $props();

	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import Loader from '@lucide/svelte/icons/loader';
	import Video from '@lucide/svelte/icons/video';
	import { NodeViewWrapper } from 'svelte-tiptap';
	import { FileType } from '../../utils.js';
	import { toast } from 'svelte-sonner';
	import strings from '../../strings.js';

	let open = $state(false);
	let videoUrl = $state('');
	let isUploading = $state(false);

	function handleSubmit(e: Event) {
		e.preventDefault();
		open = false;
		editor.chain().focus().setVideo(videoUrl).run();
	}

	async function openFileDialog() {
		isUploading = true;
		try {
			const file = await editor.storage.fileDrop.localFileGetter(FileType.VIDEO);
			if (file) {
				editor.chain().focus().setVideo(file).run();
			}
		} catch (e) {
			console.error(e);
			toast.error(strings.extension.video.openError);
		} finally {
			isUploading = false;
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
	onclick={() => (open = true)}
>
	{#if isUploading}
		<Loader class="text-primary animate-spin" />
		<span>{strings.extension.video.uploadProcessing}</span>
	{:else}
		<Video />
		<span>{strings.extension.video.insertPlaceholder}</span>
	{/if}
	<Popover.Root bind:open>
		<Popover.Trigger class="sr-only absolute left-1/2"
			>{strings.extension.video.openButton}</Popover.Trigger
		>
		<Popover.Content
			onCloseAutoFocus={(e) => e.preventDefault()}
			contenteditable={false}
			class="bg-popover w-96 rounded-lg p-0 transition-all duration-500"
			portalProps={{ disabled: true, to: undefined }}
		>
			<Tabs.Root value="local">
				<Tabs.List>
					<Tabs.Trigger value="local">{strings.extension.video.uploadTab}</Tabs.Trigger>
					<Tabs.Trigger value="url">{strings.extension.video.embedLinkTab}</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="local" class="py-2">
					<Button class="w-full" onclick={openFileDialog}
						>{strings.extension.video.uploadButton}</Button
					>
				</Tabs.Content>
				<Tabs.Content value="url" class="py-2">
					<form onsubmit={handleSubmit} class="flex flex-col gap-2">
						<Input
							placeholder={strings.extension.video.embedLinkPlaceholder}
							bind:value={videoUrl}
							required
							type="url"
						/>
						<Button type="submit">{strings.extension.video.embedLinkButton}</Button>
					</form>
				</Tabs.Content>
			</Tabs.Root>
		</Popover.Content>
	</Popover.Root>
</NodeViewWrapper>
