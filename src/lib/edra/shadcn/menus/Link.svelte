<script lang="ts">
	import SimpleTooltip from '../components/EdraToolTip.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import Check from '@lucide/svelte/icons/check';
	import Copy from '@lucide/svelte/icons/copy';
	import Edit from '@lucide/svelte/icons/pen';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import type { Editor } from '@tiptap/core';
	import BubbleMenu from '../../components/BubbleMenu.svelte';
	import type { ShouldShowProps } from '../../types.js';
	import strings from '../../strings.js';
	import { Link } from '@lucide/svelte';
	import { slide } from 'svelte/transition';

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
		<SimpleTooltip tooltip={strings.menu.link.open}>
			<Button
				variant="ghost"
				title={strings.menu.link.open}
				size="icon"
				href={link}
				target="_blank"
			>
				<Link />
			</Button>
		</SimpleTooltip>
		<SimpleTooltip tooltip={strings.menu.link.edit}>
			<Button
				variant="ghost"
				size="icon"
				title={strings.menu.link.edit}
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
				<Trash2 />
			</Button>
		</SimpleTooltip>
	{:else}
		<form
			transition:slide={{ axis: 'x' }}
			onsubmit={handleSubmit}
			class="flex w-96 items-center gap-0.5"
		>
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
