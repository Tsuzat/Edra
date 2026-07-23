<script lang="ts">
	import { NodeViewContent, NodeViewWrapper, type NodeViewProps } from '../../tiptap/index.js';

	const { editor, node, updateAttributes, extension, getPos }: NodeViewProps = $props();

	import Check from '@lucide/svelte/icons/check';
	import Copy from '@lucide/svelte/icons/copy';
	import { Sparkle } from '@lucide/svelte';
	import Tooltip from './Tooltip.svelte';

	let preRef = $state<HTMLPreElement>();
	let isCopying = $state(false);
	const languages: string[] = $derived(extension.options.lowlight.listLanguages().sort());
	let defaultLanguage = $derived<string>(node.attrs.language ?? 'plaintext');

	const changeLanguage = (e: Event) => {
		const select = e.target as HTMLSelectElement;
		const language = select.value;
		updateAttributes({ language: language });
	};

	function copyCode() {
		if (!preRef) return;
		isCopying = true;
		navigator.clipboard.writeText(preRef.innerText);
		setTimeout(() => {
			isCopying = false;
		}, 1000);
	}

	function convertToMermaid() {
		const code = node.textContent;
		const pos = getPos();
		if (typeof pos !== 'number') return;
		editor
			.chain()
			.focus()
			.deleteRange({ from: pos, to: pos + node.nodeSize })
			.insertContentAt(pos, {
				type: 'mermaid',
				content: [
					{
						type: 'text',
						text: code || ''
					}
				]
			})
			.run();
	}
</script>

<NodeViewWrapper class="codeblock-wrapper">
	<div class="codeblock-actions" contenteditable="false">
		{#if defaultLanguage.toLowerCase() === 'mermaid'}
			<Tooltip tooltip="Convert to Mermaid Diagram">
				<button class="edra-btn edra-btn-ghost edra-btn-icon-xs" onclick={convertToMermaid}>
					<Sparkle class="sparkle-icon" />
				</button>
			</Tooltip>
		{/if}

		<Tooltip tooltip="Change Language">
			<select
				disabled={!editor.isEditable}
				class="edra-select codeblock-select"
				value={defaultLanguage}
				onchange={changeLanguage}
			>
				<option value="plaintext">Plain Text</option>
				{#each languages as language (language)}
					<option value={language}>{language}</option>
				{/each}
			</select>
		</Tooltip>

		<button class="edra-btn edra-btn-ghost edra-btn-icon-xs copy-btn" onclick={copyCode}>
			{#if isCopying}
				<Check class="success-icon" />
			{:else}
				<Copy class="copy-icon" />
			{/if}
		</button>
	</div>
	<pre bind:this={preRef} draggable={false} spellcheck="false" class="codeblock-pre">
		<NodeViewContent as="code" class={`language-${defaultLanguage}`} {...node.attrs} />
	</pre>
</NodeViewWrapper>

<style>
	:global(.codeblock-wrapper) {
		margin-top: 1rem;
		margin-bottom: 1rem;
		border-radius: var(--edra-radius-lg);
		border: 1px solid var(--edra-border);
		background-color: var(--edra-canvas-soft-2);
		padding-bottom: 1rem;
	}
	.codeblock-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		justify-content: flex-end;
		padding: 0.375rem 0.5rem;
	}
	.codeblock-select {
		height: 1.75rem;
		font-size: 0.75rem;
		text-transform: capitalize;
		cursor: pointer;
		font-weight: 500;
	}
	.copy-btn {
		color: var(--edra-mute);
	}
	:global(.sparkle-icon),
	:global(.copy-icon) {
		width: 0.875rem;
		height: 0.875rem;
	}
	:global(.success-icon) {
		color: var(--edra-success) !important;
		width: 0.875rem;
		height: 0.875rem;
	}
	.codeblock-pre {
		margin: 0;
		border-top: 1px solid var(--edra-border);
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}
	@media print {
		.codeblock-actions {
			display: none;
		}
	}
</style>
