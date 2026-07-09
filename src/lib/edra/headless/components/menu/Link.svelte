<script lang="ts">
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
		placement: 'bottom',
		offset: 8,
		flip: true,
		strategy: 'fixed',
		scrollTarget: editor.view.dom.parentElement ?? window
	}}
	class="link-menu"
>
	{#if !isEditing}
		<Tooltip tooltip={strings.menu.link.open}>
			<a
				class="edra-btn edra-btn-ghost edra-btn-icon btn-size"
				href={$editorState.link}
				target="_blank"
				rel="noopener noreferrer"
				title={strings.menu.link.open}
			>
				<Link class="link-icon" />
			</a>
		</Tooltip>
		<Tooltip tooltip={strings.menu.link.edit}>
			<button
				class="edra-btn edra-btn-ghost edra-btn-icon btn-size"
				title={strings.menu.link.edit}
				onclick={() => {
					isEditing = true;
					editor.commands.blur();
				}}
			>
				<Edit class="link-icon" />
			</button>
		</Tooltip>
		<Tooltip tooltip={strings.menu.link.copy}>
			<button
				class="edra-btn edra-btn-ghost edra-btn-icon btn-size"
				title={strings.menu.link.copy}
				onclick={() => {
					window.navigator.clipboard.writeText($editorState.link);
				}}
			>
				<Copy class="link-icon" />
			</button>
		</Tooltip>
		<Tooltip tooltip={strings.menu.link.remove}>
			<button
				class="edra-btn edra-btn-ghost edra-btn-icon btn-size"
				title={strings.menu.link.remove}
				onclick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}
			>
				<Trash2 class="link-icon" />
			</button>
		</Tooltip>
	{:else}
		<form transition:slide={{ axis: 'x' }} onsubmit={handleSubmit} class="link-input-form">
			<input
				class="edra-input link-input-elem"
				bind:value={linkInput}
				required
				type="url"
				placeholder={strings.menu.link.enterLinkPlaceholder}
			/>
			<Tooltip tooltip={strings.menu.link.enterLinkButton}>
				<button type="submit" class="edra-btn edra-btn-icon-xs save-btn">
					<Check class="link-icon" />
				</button>
			</Tooltip>
		</form>
	{/if}
</BubbleMenu>

<style>
	:global(.link-menu) {
		display: flex;
		height: fit-content;
		width: fit-content;
		align-items: center;
		gap: 4px;
		border-radius: var(--edra-radius-lg);
		border: 1px solid var(--edra-border);
		padding: 4px;
		background-color: var(--edra-canvas);
		box-shadow: var(--edra-shadow-4);
	}
	.btn-size {
		width: 2rem;
		height: 2rem;
	}
	:global(.link-icon) {
		width: 1rem;
		height: 1rem;
	}
	.link-input-form {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 4px;
		width: 24rem;
	}
	.link-input-elem {
		height: 2rem;
		flex: 1;
	}
	.save-btn {
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
