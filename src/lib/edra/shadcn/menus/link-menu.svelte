<script lang="ts">
	import { type Editor } from '@tiptap/core';
	import { BubbleMenu } from 'svelte-tiptap';
	import type { ShouldShowProps } from '../../utils.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Copy from 'lucide-svelte/icons/copy';
	import Pencil from 'lucide-svelte/icons/pen';
	import Trash from 'lucide-svelte/icons/trash';
	import Check from 'lucide-svelte/icons/check';
	import { cn } from '$lib/utils.js';
	import { Input } from '$lib/components/ui/input/index.js';
	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();

	let link = $derived.by(() => editor.getAttributes('link').href);

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
	class="-z-50 flex h-fit w-fit items-center gap-1 rounded border bg-background p-1 shadow-lg"
>
	{#if isEditing}
		<Input
			placeholder="Enter link to attach.."
			type="url"
			bind:value={linkInput}
			class={cn('w-full border-2', isLinkValid ? 'border-green-500' : 'border-red-500')}
		/>
	{:else}
		<Button variant="link" href={link} class="max-w-80 p-1" target="_blank">
			<span class="w-full overflow-hidden text-ellipsis">
				{link}
			</span>
		</Button>
	{/if}
	{#if isEditing}
		<Button
			variant="ghost"
			disabled={!isLinkValid}
			title={isLinkValid ? 'Set Link' : 'Invalid URL'}
			class="size-7 p-1"
			onclick={() => {
				isEditing = false;
				editor.commands.focus();
				setLink(linkInput);
			}}
		>
			<Check />
		</Button>
	{:else}
		<Button
			variant="ghost"
			title="Edit Link"
			class="size-7 p-1"
			onclick={() => {
				isEditing = true;
				linkInput = editor.getAttributes('link').href;
				editor.commands.blur();
			}}
		>
			<Pencil />
		</Button>
		<Button
			variant="ghost"
			title="Copy Link"
			class="size-7 p-1"
			onclick={() => {
				navigator.clipboard.writeText(link);
			}}
		>
			<Copy />
		</Button>
		<Button
			variant="ghost"
			title="Remove Link"
			class="size-7 p-1"
			onclick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}
		>
			<Trash />
		</Button>
	{/if}
</BubbleMenu>
