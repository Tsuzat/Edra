<script lang="ts">
	import { type Editor } from '@tiptap/core';
	import { BubbleMenu } from 'svelte-tiptap';
	import type { ShouldShowProps } from '../../utils.js';
	import Copy from 'lucide-svelte/icons/copy';
	import Trash from 'lucide-svelte/icons/trash';
	import Edit from 'lucide-svelte/icons/pen';
	import Check from 'lucide-svelte/icons/check';

	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();

	const link = $derived.by(() => editor.getAttributes('link').href);

	let isEditing = $state(false);

	function setLink(url: string) {
		if (url.trim() === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();
			return;
		}
		editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
	}

	let linkInput = $state('');
	let isLinkValid = $state(true);

	$effect(() => {
		isLinkValid = validateURL(linkInput);
	});

	function validateURL(url: string): boolean {
		const urlPattern = new RegExp(
			'^(https?:\\/\\/)?' + // protocol (optional)
				'((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|' + // domain name and extension
				'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
				'(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*' + // port and path
				'(\\?[;&a-zA-Z\\d%_.~+=-]*)?' + // query string
				'(\\#[-a-zA-Z\\d_]*)?$', // fragment locator
			'i'
		);
		return urlPattern.test(url);
	}
</script>

<BubbleMenu
	{editor}
	pluginKey="link-menu"
	shouldShow={(props: ShouldShowProps) => {
		if (props.editor.isActive('link')) {
			return true;
		} else {
			isEditing = false;
			linkInput = '';
			isLinkValid = true;
			return false;
		}
	}}
	class="bubble-menu-wrapper"
>
	{#if isEditing}
		<input
			type="text"
			bind:value={linkInput}
			placeholder="Enter the URL"
			disabled={!isEditing}
			class:valid={isLinkValid}
			class:invalid={!isLinkValid}
		/>
	{:else}
		<a href={link} target="_blank">{link}</a>
	{/if}

	{#if !isEditing}
		<button
			class="edra-command-button"
			onclick={() => {
				linkInput = link;
				isEditing = true;
			}}
			title="Edit the URL"
		>
			<Edit class="edra-toolbar-icon" />
		</button>
		<button
			class="edra-command-button"
			onclick={() => {
				navigator.clipboard.writeText(link);
			}}
			title="Copy the URL to the clipboard"
		>
			<Copy class="edra-toolbar-icon" />
		</button>
		<button
			class="edra-command-button"
			onclick={() => {
				editor.chain().focus().extendMarkRange('link').unsetLink().run();
			}}
			title="Remove the link"
		>
			<Trash class="edra-toolbar-icon" />
		</button>
	{:else}
		<button
			class="edra-command-button"
			onclick={() => {
				isEditing = false;
				editor.commands.focus();
				setLink(linkInput);
			}}
			disabled={!isLinkValid}
		>
			<Check class="edra-toolbar-icon" />
		</button>
	{/if}
</BubbleMenu>
