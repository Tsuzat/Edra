<script lang="ts">
	import type { Editor } from '../Editor.ts';

	let { editor, class: className }: { editor: Editor | null; class: string } = $props();

	let rootEl: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (!editor || !rootEl) {
			return;
		}

		if (!editor.view.dom?.parentNode) {
			return;
		}

		const element = rootEl;

		// eslint-disable-next-line svelte/no-dom-manipulating
		rootEl.append(...editor.view.dom.parentNode.childNodes);

		editor.setOptions({
			element
		});

		editor.createNodeViews();
	});
</script>

<div bind:this={rootEl} class={className}></div>
