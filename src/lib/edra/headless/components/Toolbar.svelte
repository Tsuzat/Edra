<script lang="ts">
	import { commands } from '$lib/edra/commands/index.js';
	import { addAIHighlight, getEditor, useEditorTransaction } from '$lib/edra/tiptap/index.js';
	import { cn } from '$lib/utils.js';
	import { WandSparkles } from '@lucide/svelte';
	import Colors from './tools/Colors.svelte';
	import Export from './tools/Export.svelte';
	import FontSize from './tools/FontSize.svelte';
	import Tooltip from './Tooltip.svelte';
	interface Props {
		class?: string;
	}
	const { class: className }: Props = $props();

	const editor = getEditor();

	const transaction = useEditorTransaction(editor);
	const commandsKeys = Object.keys(commands);

	function useAI() {
		void transaction.version;
		return editor.extensionManager.extensions.some(
			(e) => e.name === 'ai-highlight' && e.options?.callAI != null
		);
	}

	function isActive(command: (typeof commands)[string][number]): boolean {
		void transaction.version;
		return command.isActive?.(editor) ?? false;
	}
	function isClickable(command: (typeof commands)[string][number]): boolean {
		void transaction.version;
		return command.clickable?.(editor) ?? true;
	}
</script>

<div class={cn('toolbar-container', className)}>
	{#if useAI()}
		<Tooltip tooltip="Use AI">
			<button
				onmousedown={(e) => {
					e.preventDefault();
					addAIHighlight(editor);
				}}
				class="edra-btn edra-btn-ghost edra-btn-icon"
			>
				<WandSparkles />
			</button>
		</Tooltip>
	{/if}
	{#each commandsKeys as key (key)}
		{@const group = commands[key]}
		{#each group as command, idx (idx)}
			{@const Icon = command.icon}
			<Tooltip tooltip={command.tooltip} shortCut={command.shortCut ?? ''}>
				<button
					class="edra-btn edra-btn-ghost edra-btn-icon {isActive(command) ? 'active' : ''}"
					disabled={!isClickable(command)}
					onclick={() => {
						command.onClick?.(editor);
					}}
				>
					<Icon />
				</button>
			</Tooltip>
		{/each}
		<div class="edra-separator" role="separator" aria-orientation="vertical"></div>
	{/each}
	<FontSize />
	<Colors />
	<Export />
</div>

<style>
	.toolbar-container {
		display: flex;
		align-items: center;
		height: 100%;
		width: fit-content;
		gap: 0.5rem;
	}
	.active {
		background-color: var(--edra-canvas-soft-2) !important;
		color: var(--edra-ink) !important;
	}
</style>
