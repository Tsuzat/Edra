<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { type TableOfContentData } from '@tiptap/extension-table-of-contents';
	import { TextSelection } from '@tiptap/pm/state';

	interface Props {
		editor: Editor;
		items?: TableOfContentData;
	}

	const { editor, items = [] }: Props = $props();

	const onItemClick = (e: Event, id: string) => {
		e.preventDefault();
		const element = editor.view.dom.querySelector(`[data-toc-id="${id}"`);
		if (!element) return;
		const pos = editor.view.posAtDOM(element, 0);
		const tr = editor.view.state.tr;
		tr.setSelection(new TextSelection(tr.doc.resolve(pos)));
		editor.view.dispatch(tr);
		editor.view.focus();
		element.scrollIntoView({ behavior: 'smooth' });
	};
</script>

{#if items && items.length > 0}
	<div class="edra-toc">
		<div class="edra-toc-trigger">
			{#each items as item (item.id)}
				<div
					class={`edra-toc-dot ${item.isActive ? 'active' : ''}`}
					style={`width: ${item.level === 1 ? '1.5rem' : '1rem'}`}
				></div>
			{/each}
		</div>
		<div class="edra-toc-content">
			{#each items as item (item.id)}
				<a
					href={`#${item.id}`}
					onclick={(e) => onItemClick(e, item.id)}
					class={`edra-toc-item ${item.isScrolledOver ? 'scrolled-over' : ''}`}
					style={`padding-left: calc(0.5rem * ${item.level - 1});`}
				>
					{item.textContent}
				</a>
			{/each}
		</div>
	</div>
{/if}

<style>
	.edra-toc {
		position: fixed;
		top: 30%;
		right: 1rem;
		display: flex;
		flex-direction: row-reverse;
		gap: 1rem;
		z-index: 50;
	}
	.edra-toc-trigger {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		cursor: pointer;
		padding: 0.5rem;
		border-radius: 0.5rem;
		background: rgba(255, 255, 255, 0.5);
		backdrop-filter: blur(4px);
	}
	.edra-toc-dot {
		height: 4px;
		background-color: #888;
		border-radius: 2px;
		opacity: 0.5;
		transition: all 0.2s;
	}
	.edra-toc-dot.active {
		background-color: #333;
		opacity: 1;
	}
	.edra-toc-content {
		display: none;
		flex-direction: column;
		gap: 0.5rem;
		background: white;
		border: 1px solid #ddd;
		padding: 1rem;
		border-radius: 0.5rem;
		max-height: 50vh;
		overflow-y: auto;
		width: 200px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}
	.edra-toc:hover .edra-toc-content {
		display: flex;
	}
	.edra-toc-item {
		font-size: 0.875rem;
		text-decoration: none;
		color: #333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: block;
	}
	.edra-toc-item:hover {
		text-decoration: underline;
	}
	.edra-toc-item.scrolled-over {
		color: #999;
		font-style: italic;
	}
</style>
