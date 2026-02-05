<script lang="ts">
	import type { NodeViewProps } from '@tiptap/core';

	const { editor }: NodeViewProps = $props();

	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import Image from '@lucide/svelte/icons/image';
	import Loader from '@lucide/svelte/icons/loader';
	import { toast } from 'svelte-sonner';
	import { NodeViewWrapper } from 'svelte-tiptap';
	import { FileType } from '../../utils.js';
	import strings from '../../strings.js';

	let open = $state(false);
	let imageUrl = $state('');
	let isUploading = $state(false);

	function handleSubmit(e: Event) {
		e.preventDefault();
		open = false;
		editor.chain().focus().setImage({ src: imageUrl }).run();
	}

	async function openFileDialog() {
		isUploading = true;
		try {
			const file = await editor.storage.fileDrop.localFileGetter(FileType.IMAGE);
			if (file) {
				editor.chain().focus().setImage({ src: file }).run();
			}
		} catch (e) {
			console.error(e);
			toast.error(strings.extension.image.openError);
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
		class: 'media-placeholder relative my-4! flex w-full items-center justify-start gap-4 p-6'
	})}
	style="user-select: none;"
	draggable={true}
	onclick={() => (open = true)}
>
	{#if !isUploading}
		<Image />
		<span>{strings.extension.image.insertPlaceholder}</span>
	{:else}
		<Loader class="text-primary animate-spin" />
		<span>{strings.extension.image.uploadProcessing}</span>
	{/if}
	<Popover.Root bind:open>
		<Popover.Trigger class="sr-only absolute left-1/2"
			>{strings.extension.image.openButton}</Popover.Trigger
		>
		<Popover.Content
			onCloseAutoFocus={(e) => e.preventDefault()}
			contenteditable={false}
			class="bg-popover z-50 w-96 rounded-lg p-0"
			portalProps={{ disabled: true, to: undefined }}
		>
			<Tabs.Root value="local">
				<Tabs.List>
					<Tabs.Trigger value="local">{strings.extension.image.uploadTab}</Tabs.Trigger>
					<Tabs.Trigger value="url">{strings.extension.image.embedLinkTab}</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="local" class="py-2">
					<Button class="w-full" onclick={openFileDialog}
						>{strings.extension.image.uploadButton}</Button
					>
				</Tabs.Content>
				<Tabs.Content value="url" class="py-2">
					<form onsubmit={handleSubmit} class="flex flex-col gap-2">
						<Input
							placeholder={strings.extension.image.embedLinkPlaceholder}
							bind:value={imageUrl}
							required
							type="url"
						/>
						<Button type="submit">{strings.extension.image.embedLinkButton}</Button>
					</form>
				</Tabs.Content>
			</Tabs.Root>
		</Popover.Content>
	</Popover.Root>
</NodeViewWrapper>
