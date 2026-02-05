<script lang="ts">
	import SimpleTooltip from '../components/EdraToolTip.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import Check from '@lucide/svelte/icons/check';
	import Copy from '@lucide/svelte/icons/copy';
	import Edit from '@lucide/svelte/icons/edit';
	import Trash from '@lucide/svelte/icons/trash';
	import type { Editor } from '@tiptap/core';
	import BubbleMenu from '../../components/BubbleMenu.svelte';
	import type { ShouldShowProps } from '../../types.js';
	import strings from '../../strings.js';

	interface Props {
		editor: Editor;
		parentElement?: HTMLElement;
	}
	const { editor, parentElement }: Props = $props();

	let link = $derived.by(() => editor.getAttributes('link').href);

	let isEditing = $state(false);

	let linkInput = $derived(link);

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!linkInput || linkInput.trim() === '') return;
		isEditing = false;
		editor.chain().focus().extendMarkRange('link').setLink({ href: linkInput }).run();
	}
</script>

<BubbleMenu
	{editor}
	pluginKey="link-bubble-menu"
	shouldShow={(props: ShouldShowProps) => {
		if (props.editor.isActive('link')) {
			return true;
		} else {
			isEditing = false;
			linkInput = undefined;
			return false;
		}
	}}
	options={{
		shift: true,
		autoPlacement: {
			allowedPlacements: ['top', 'top-end', 'top-start']
		},
		strategy: 'absolute',
		scrollTarget: parentElement
	}}
	class="bg-popover flex h-fit w-fit items-center gap-1 rounded-lg border p-0!"
>
	{#if !isEditing}
		<Button
			variant="link"
			href={link}
			class="max-w-120 truncate overflow-hidden p-1 text-ellipsis underline"
			target="_blank"
		>
			{link}
		</Button>
		<SimpleTooltip tooltip={strings.menu.link.edit}>
			<Button
				variant="ghost"
				size="icon"
				onclick={() => {
					isEditing = true;
					editor.commands.blur();
				}}
			>
				<Edit />
			</Button>
		</SimpleTooltip>
		<SimpleTooltip tooltip={strings.menu.link.copy}>
			<Button
				variant="ghost"
				title={strings.menu.link.copy}
				size="icon"
				onclick={() => {
					window.navigator.clipboard.writeText(link);
				}}
			>
				<Copy />
			</Button>
		</SimpleTooltip>
		<SimpleTooltip tooltip={strings.menu.link.remove}>
			<Button
				variant="ghost"
				title={strings.menu.link.remove}
				size="icon"
				onclick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}
			>
				<Trash />
			</Button>
		</SimpleTooltip>
	{:else}
		<form onsubmit={handleSubmit} class="flex max-w-120 items-center gap-0.5">
			<Input
				bind:value={linkInput}
				required
				type="url"
				placeholder={strings.menu.link.enterLinkPlaceholder}
			/>
			<SimpleTooltip tooltip={strings.menu.link.enterLinkButton}>
				<Button type="submit" size="icon">
					<Check />
				</Button>
			</SimpleTooltip>
		</form>
	{/if}
</BubbleMenu>
