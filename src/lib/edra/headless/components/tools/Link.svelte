<script lang="ts">
	import Popover from '../../primitives/Popover.svelte';
	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Link from '@lucide/svelte/icons/link-2';
	import Tooltip from '../Tooltip.svelte';
	import { getEditor, useEditorTransaction } from '$lib/edra/tiptap/index.js';

	let open = $state(false);

	let value = $state<string>();
	const editor = getEditor();
	const transaction = useEditorTransaction(editor);
	function isActive() {
		void transaction.version;
		return editor.isActive('link');
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (value === undefined || value.trim() === '') return;
		editor.chain().focus().setLink({ href: value }).run();
		value = undefined;
		open = false;
	}
</script>

<Popover bind:open>
	{#snippet trigger()}
		<Tooltip tooltip="Link">
			<div class="edra-btn edra-btn-ghost edra-btn-icon {isActive() ? 'active' : ''}">
				<Link />
				<ChevronDown class="chevron-icon" />
			</div>
		</Tooltip>
	{/snippet}

	<form class="link-form" onsubmit={handleSubmit}>
		<input
			class="edra-input link-input"
			placeholder="Type or paste a link..."
			bind:value
			required
			type="url"
		/>
		<Tooltip tooltip="Insert link">
			<button type="submit" class="edra-btn edra-btn-icon-xs check-btn">
				<Check />
			</button>
		</Tooltip>
	</form>
</Popover>

<style>
	.active {
		background-color: var(--edra-canvas-soft-2) !important;
		color: var(--edra-ink) !important;
	}
	.link-form {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 4px;
		min-width: 20rem;
	}
	.link-input {
		height: 2rem;
		font-size: 0.875rem;
		flex: 1;
	}
	.check-btn {
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	:global(.chevron-icon) {
		color: var(--edra-mute);
		width: 0.5rem;
		height: 0.5rem;
	}
</style>
