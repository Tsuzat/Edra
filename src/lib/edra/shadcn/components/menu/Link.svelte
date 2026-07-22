<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import Check from '@lucide/svelte/icons/check';
	import Copy from '@lucide/svelte/icons/copy';
	import Edit from '@lucide/svelte/icons/pen';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { Link } from '@lucide/svelte';
	import { slide } from 'svelte/transition';
	import Tooltip from '../Tooltip.svelte';
	import strings from '../../../strings.js';
	import { BubbleMenu, getEditor, useEditorState } from '$lib/edra/tiptap/index.js';

	const editor = getEditor();

	const editorState = useEditorState({
		editor,
		selector: ({ editor }) => ({
			link: editor.getAttributes('link').href as string
		})
	});

	let isEditing = $state(false);

	let linkInput = $derived($editorState.link);

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!linkInput || linkInput.trim() === '') return;
		isEditing = false;
		editor.chain().focus().extendMarkRange('link').setLink({ href: linkInput }).run();
	}
</script>

<BubbleMenu
	{editor}
	shouldShow={(props) => {
		if (props.editor.isActive('link')) {
			return true;
		} else {
			isEditing = false;
			linkInput = '';
			return false;
		}
	}}
	options={{
		shift: true,
		autoPlacement: {
			allowedPlacements: ['top', 'bottom']
		},
		strategy: 'absolute',
		scrollTarget: editor.view.dom.parentElement ?? window
	}}
	class="flex h-fit w-fit items-center gap-1 rounded-lg border bg-popover p-0!"
>
	{#if !isEditing}
		<Tooltip tooltip={strings.menu.link.open}>
			<Button
				variant="ghost"
				title={strings.menu.link.open}
				size="icon"
				href={$editorState.link}
				target="_blank"
			>
				<Link />
			</Button>
		</Tooltip>
		<Tooltip tooltip={strings.menu.link.edit}>
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
		</Tooltip>
		<Tooltip tooltip={strings.menu.link.copy}>
			<Button
				variant="ghost"
				title={strings.menu.link.copy}
				size="icon"
				onclick={() => {
					window.navigator.clipboard.writeText($editorState.link);
				}}
			>
				<Copy />
			</Button>
		</Tooltip>
		<Tooltip tooltip={strings.menu.link.remove}>
			<Button
				variant="ghost"
				title={strings.menu.link.remove}
				size="icon"
				onclick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}
			>
				<Trash2 />
			</Button>
		</Tooltip>
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
			<Tooltip tooltip={strings.menu.link.enterLinkButton}>
				<Button type="submit" size="icon">
					<Check />
				</Button>
			</Tooltip>
		</form>
	{/if}
</BubbleMenu>
