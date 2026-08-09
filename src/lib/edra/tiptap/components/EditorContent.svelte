<script lang="ts">
	import { untrack } from 'svelte';
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

		// Already mounted — avoid re-appending / re-creating on every transaction
		if (rootEl.contains(editor.view.dom)) {
			return;
		}

		const element = rootEl;

		untrack(() => {
			const parent = editor.view.dom.parentNode!;
			rootEl!.append(...parent.childNodes);

			editor.setOptions({
				element
			});

			editor.createNodeViews();
		});
	});
</script>

<div bind:this={rootEl} class={className}></div>
