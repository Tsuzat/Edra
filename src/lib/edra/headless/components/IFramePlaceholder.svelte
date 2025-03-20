<script lang="ts">
	import type { NodeViewProps } from '@tiptap/core';
	import CodeXML from 'lucide-svelte/icons/code-xml';
	import { NodeViewWrapper } from 'svelte-tiptap';
	const { editor }: NodeViewProps = $props();

	function handleClick(e: MouseEvent) {
		e.preventDefault();
		const iFrameURL = prompt('Enter the URL of an iFrame:');
		if (!iFrameURL) {
			return;
		}
		editor.chain().focus().setIframe({ src: iFrameURL }).run();
	}
</script>

<NodeViewWrapper class="edra-media-placeholder-wrapper" contenteditable={false} spellcheck={false}>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<span
		class="edra-media-placeholder-content"
		onclick={handleClick}
		tabindex="0"
		role="button"
		aria-label="Insert An Audio"
	>
		<CodeXML class="edra-media-placeholder-icon" />
		<span class="edra-media-placeholder-text">Insert An IFrame</span>
	</span>
</NodeViewWrapper>
