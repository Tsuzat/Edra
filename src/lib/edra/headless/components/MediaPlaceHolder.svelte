<script lang="ts">
	import { NodeViewWrapper } from '$lib/edra/tiptap/index.js';
	import { AudioLines, Video, Image, CodeXml } from '@lucide/svelte';
	import { type NodeViewProps } from '@tiptap/core';
	import Popover from '../primitives/Popover.svelte';
	import { Tabs, TabsList, TabsTrigger, TabsContent } from '../primitives/tabs/index.ts';

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

<NodeViewWrapper class="placeholder-wrapper">
	{@const Icon = mediaTypeData?.icon}
	{@const text = mediaTypeData?.text}

	<Popover bind:open class="popover-container">
		{#snippet trigger()}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
			<div role="button" tabindex={1} class="placeholder-card">
				<Icon class="icon" />
				<span class="text-span" contenteditable={false}>{text}</span>
			</div>
		{/snippet}

		<Tabs value="link" class="tabs-container">
			<TabsList class="tabs-list-margin">
				<TabsTrigger value="link">Link</TabsTrigger>
				{#if mediaType !== 'iframe'}
					<TabsTrigger value="file">File</TabsTrigger>
				{/if}
			</TabsList>
			<TabsContent value="link">
				<form
					class="form-container"
					onsubmit={(e) => {
						e.preventDefault();
						setMediaFn(url);
						open = false;
					}}
				>
					<input
						type="url"
						bind:value={url}
						class="edra-input"
						placeholder="Paste URL here..."
						required
					/>
					<button type="submit" class="edra-btn edra-btn-primary h-8-btn">Insert {mediaType}</button
					>
				</form>
			</TabsContent>
			{#if mediaType !== 'iframe'}
				<TabsContent value="file">
					<form class="form-container" onsubmit={handleFileSubmit}>
						<input type="file" bind:files class="edra-input file-input" required />
						<button type="submit" class="edra-btn edra-btn-primary h-8-btn"
							>Insert {mediaType}</button
						>
					</form>
				</TabsContent>
			{/if}
		</Tabs>
	</Popover>
</NodeViewWrapper>

<style>
	:global(.placeholder-wrapper) {
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
	}
	:global(.popover-container) {
		padding: 1rem !important;
		width: 18rem;
	}
	.placeholder-card {
		display: flex;
		width: 100%;
		align-items: center;
		gap: 0.5rem;
		border-radius: var(--edra-radius-lg);
		border: 1px dashed var(--edra-border);
		padding: 1rem;
		transition: background-color 150ms ease;
		cursor: pointer;
		background-color: var(--edra-canvas-soft);
		min-height: 3.5rem;
	}
	.placeholder-card:hover {
		background-color: var(--edra-canvas-soft-2);
	}
	.text-span {
		color: var(--edra-mute);
		font-size: 0.875rem;
	}
	:global(.icon) {
		color: var(--edra-mute) !important;
		width: 1rem;
		height: 1rem;
	}
	:global(.tabs-container) {
		width: 100%;
	}
	:global(.tabs-list-margin) {
		margin-bottom: 12px;
	}
	.form-container {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.h-8-btn {
		height: 2rem;
		text-transform: capitalize;
		font-size: 0.75rem;
	}
	.file-input {
		padding: 4px;
	}
</style>
