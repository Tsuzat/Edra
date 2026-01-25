<script lang="ts">
	import type { ShouldShowProps } from '../../types.js';
	import BubbleMenu from '../../components/BubbleMenu.svelte';
	import type { Editor } from '@tiptap/core';
	import Copy from '@lucide/svelte/icons/copy';
	import Trash from '@lucide/svelte/icons/trash';
	import Edit from '@lucide/svelte/icons/edit';
	import Check from '@lucide/svelte/icons/check';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();

	let link = $derived.by(() => editor.getAttributes('link').href);
	let isEditing = $state(false);
	let linkInput = $derived(link);

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!linkInput || linkInput.trim() === '') return;
		isEditing = false;
		editor.chain().focus().extendMarkRange('link').setLink({ href: linkInput }).run();
	}

	$effect(() => {
		if (isEditing) {
			linkInput = link;
		}
	});
</script>

<BubbleMenu
	{editor}
	pluginKey="link-bubble-menu"
	shouldShow={(props: ShouldShowProps) => {
		if (props.editor.isActive('link')) {
			return true;
		} else {
			isEditing = false;
			return false;
		}
	}}
>
	{#if !isEditing}
		<a href={link} target="_blank" class="edra-link-preview">
			{link}
		</a>
		<button
			title="Edit Link"
			class="edra-command-button"
			onclick={() => {
				isEditing = true;
				// editor.commands.blur(); // Optional
			}}
		>
			<Edit class="edra-toolbar-icon" />
		</button>
		<button
			title="Copy Link"
			class="edra-command-button"
			onclick={() => {
				navigator.clipboard.writeText(link);
			}}
		>
			<Copy class="edra-toolbar-icon" />
		</button>
		<button
			class="edra-command-button"
			title="Remove Link"
			onclick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}
		>
			<Trash class="edra-toolbar-icon" />
		</button>
	{:else}
		<form onsubmit={handleSubmit} class="edra-link-form">
			<input
				bind:value={linkInput}
				required
				type="url"
				placeholder="Type or paste a link"
				class="edra-link-input"
			/>
			<button type="submit" class="edra-command-button" title="Save">
				<Check class="edra-toolbar-icon" />
			</button>
		</form>
	{/if}
</BubbleMenu>

<style>
	.edra-link-preview {
		max-width: 150px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-right: 0.5rem;
	}
	.edra-link-form {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.edra-link-input {
		padding: 0.25rem;
		border: 1px solid #ccc;
		border-radius: 0.25rem;
	}
</style>
