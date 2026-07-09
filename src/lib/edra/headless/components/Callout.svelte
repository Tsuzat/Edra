<script lang="ts">
	import { NodeViewContent, NodeViewWrapper, type NodeViewProps } from '$lib/edra/tiptap/index.js';
	import Popover from '../primitives/Popover.svelte';

	const { node, updateAttributes }: NodeViewProps = $props();

	let emoji = $derived(node.attrs.emoji ?? '💡');

	function handleEmojiInput(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.value) {
			const emojiChar = Array.from(target.value)[0] || '💡';
			updateAttributes({ emoji: emojiChar });
		}
	}
</script>

<NodeViewWrapper class="callout-wrapper">
	<div contenteditable="false" class="emoji-trigger-container">
		<Popover>
			{#snippet trigger()}
				<button class="edra-btn edra-btn-ghost edra-btn-icon emoji-trigger-btn">
					{emoji}
				</button>
			{/snippet}

			<div class="emoji-popover-content">
				<div class="input-wrapper">
					<label for="emoji" class="emoji-label">Emoji Icon</label>
					<input
						id="emoji"
						value={emoji}
						oninput={handleEmojiInput}
						placeholder="Paste or type an emoji..."
						class="edra-input emoji-input"
						maxlength={10}
					/>
				</div>
			</div>
		</Popover>
	</div>

	<div class="callout-content-container">
		<NodeViewContent class="edra-callout-content" />
	</div>
</NodeViewWrapper>

<style>
	:global(.callout-wrapper) {
		margin-top: 1rem;
		margin-bottom: 1rem;
		display: flex;
		gap: 0.75rem;
		padding: 1rem;
		border-radius: var(--edra-radius-lg);
		border: 1px solid var(--edra-border);
		transition: background-color 150ms ease;
		background-color: var(--edra-canvas-soft-2);
	}
	.emoji-trigger-container {
		user-select: none;
		display: flex;
		align-items: flex-start;
		margin-top: 0.125rem;
	}
	.emoji-trigger-btn {
		width: 1.75rem;
		height: 1.75rem;
		font-size: 1.125rem;
		padding: 0;
	}
	.emoji-popover-content {
		padding: 12px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		box-shadow: var(--edra-shadow-4);
		width: 12rem;
	}
	.input-wrapper {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.emoji-label {
		font-size: 10px;
		color: var(--edra-mute);
		text-transform: uppercase;
		font-weight: 700;
	}
	.emoji-input {
		height: 2rem;
		font-size: 0.875rem;
	}
	.callout-content-container {
		flex: 1;
		min-width: 8px;
		line-height: 1.625;
	}
</style>
