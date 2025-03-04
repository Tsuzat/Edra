<script lang="ts">
	import { NodeViewWrapper, NodeViewContent } from 'svelte-tiptap';
	import type { NodeViewProps } from '@tiptap/core';
	const { node, updateAttributes, extension }: NodeViewProps = $props();

	let preRef = $state<HTMLPreElement>();

	let isCopying = $state(false);

	const languages: string[] = extension.options.lowlight.listLanguages().sort();

	let defaultLanguage = $state(node.attrs.language);

	$effect(() => {
		updateAttributes({ language: defaultLanguage });
	});

	function copyCode() {
		if (isCopying) return;
		if (!preRef) return;
		isCopying = true;
		navigator.clipboard.writeText(preRef.innerText);
		setTimeout(() => {
			isCopying = false;
		}, 1000);
	}
</script>

<NodeViewWrapper class="code-wrapper">
	<div class="code-wrapper-tile" contenteditable="false">
		<select bind:value={defaultLanguage} class="code-wrapper-select">
			{#each languages as language}
				<option value={language}>{language}</option>
			{/each}
		</select>
		<button class="code-wrapper-copy" onclick={copyCode}>
			{#if isCopying}
				<span class="code-wrapper-copy-text copied">Copied!</span>
			{:else}
				<span class="code-wrapper-copy-text">Copy</span>
			{/if}
		</button>
	</div>
	<pre bind:this={preRef} spellcheck="false">
		<NodeViewContent as="code" class={`language-${defaultLanguage}`} {...node.attrs} />	
	</pre>
</NodeViewWrapper>
