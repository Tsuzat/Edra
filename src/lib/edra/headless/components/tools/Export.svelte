<script lang="ts">
	import { Root, Trigger, Content, Label, Item } from '../../primitives/dropdown/index.ts';
	import { getEditor } from '$lib/edra/tiptap/index.js';
	import { ChevronDown, Download } from '@lucide/svelte';
	const editor = getEditor();
	const handleExport = (as: 'markdown' | 'html' | 'json') => {
		let text = '';
		let mimeType = '';
		let extension = '';

		switch (as) {
			case 'markdown':
				text = editor.getMarkdown();
				mimeType = 'text/markdown;charset=utf-8';
				extension = 'md';
				break;
			case 'html':
				text = editor.getHTML();
				mimeType = 'text/html;charset=utf-8';
				extension = 'html';
				break;
			case 'json':
				text = JSON.stringify(editor.getJSON(), null, 2);
				mimeType = 'application/json;charset=utf-8';
				extension = 'json';
				break;
		}

		// Try to find a title from the first heading, or use a default
		let filename = 'document';
		const firstNode = editor.state.doc.firstChild;
		if (firstNode && firstNode.type.name === 'heading') {
			const textContent = firstNode.textContent.trim();
			if (textContent) {
				filename = textContent
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, '-')
					.replace(/(^-|-$)/g, '');
			}
		}
		if (!filename) {
			filename = 'document';
		}

		const blob = new Blob([text], { type: mimeType });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${filename}.${extension}`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};
</script>

<Root>
	<Trigger class="edra-btn edra-btn-ghost edra-btn-icon">
		<Download />
		<ChevronDown class="chevron-icon" />
	</Trigger>

	<style>
		:global(.chevron-icon) {
			color: var(--edra-mute);
			width: 0.5rem;
			height: 0.5rem;
		}
	</style>
	<Content>
		<Label>Export As</Label>
		<Item onclick={() => handleExport('markdown')}>Markdown</Item>
		<Item onclick={() => handleExport('html')}>HTML</Item>
		<Item onclick={() => handleExport('json')}>JSON</Item>
	</Content>
</Root>
