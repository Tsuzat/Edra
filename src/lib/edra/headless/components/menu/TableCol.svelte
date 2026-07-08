<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ArrowLeftFromLine from '@lucide/svelte/icons/arrow-left-from-line';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ArrowRightFromLine from '@lucide/svelte/icons/arrow-right-from-line';
	import Sheet from '@lucide/svelte/icons/sheet';
	import Trash from '@lucide/svelte/icons/trash';
	import {
		isColumnGripSelected,
		moveColumnLeft,
		moveColumnRight
	} from '../../../tiptap/extensions/table/index.js';
	import { BubbleMenu, getEditor } from '$lib/edra/tiptap/index.js';
	import strings from '../../../strings.js';
	const editor = getEditor();
</script>

<BubbleMenu
	{editor}
	pluginKey="table-col-menu"
	shouldShow={(props) => {
		if (!props.editor.isEditable) return false;
		if (!props.state) {
			return false;
		}
		return isColumnGripSelected({ editor, view: props.view, state: props.state, from: props.from });
	}}
	options={{
		shift: {
			crossAxis: true,
			mainAxis: true
		},
		strategy: 'fixed',
		autoPlacement: {
			allowedPlacements: ['bottom', 'top']
		},
		scrollTarget: editor.view.dom.parentElement ?? window
	}}
	class="table-menu"
>
	<button
		class="menu-item"
		title={strings.menu.table.headerColumn}
		onclick={() => editor.chain().focus().toggleHeaderColumn().run()}
	>
		<Sheet class="icon-mute" />
		<span>{strings.menu.table.headerColumn}</span>
	</button>
	<div class="divider"></div>
	<button
		class="menu-item"
		title={strings.menu.table.addColumnAfter}
		onclick={() => editor.chain().focus().addColumnAfter().run()}
	>
		<ArrowRightFromLine class="icon-mute" />
		<span>{strings.menu.table.addColumnAfter}</span>
	</button>
	<button
		class="menu-item"
		title={strings.menu.table.addColumnBefore}
		onclick={() => editor.chain().focus().addColumnBefore().run()}
	>
		<ArrowLeftFromLine class="icon-mute" />
		<span>{strings.menu.table.addColumnBefore}</span>
	</button>
	<div class="divider"></div>
	<button
		class="menu-item"
		title={strings.menu.table.moveColumnLeft}
		onclick={() => editor.view.dispatch(moveColumnLeft(editor.state.tr))}
	>
		<ArrowLeft class="icon-mute" />
		<span>{strings.menu.table.moveColumnLeft}</span>
	</button>
	<button
		class="menu-item"
		title={strings.menu.table.moveColumnRight}
		onclick={() => editor.view.dispatch(moveColumnRight(editor.state.tr))}
	>
		<ArrowRight class="icon-mute" />
		<span>{strings.menu.table.moveColumnRight}</span>
	</button>
	<div class="divider"></div>
	<button
		class="menu-item delete-item"
		title={strings.menu.table.deleteColumn}
		data-variant="destructive"
		onclick={() => editor.chain().focus().deleteColumn().run()}
	>
		<Trash class="trash-icon" />
		<span>{strings.menu.table.deleteColumn}</span>
	</button>
</BubbleMenu>

<style>
	:global(.table-menu) {
		display: flex;
		height: fit-content;
		width: fit-content;
		flex-direction: column;
		gap: 2px;
		border-radius: var(--edra-radius-lg);
		border: 1px solid var(--edra-border);
		padding: 4px;
		background-color: var(--edra-canvas);
		box-shadow: var(--edra-shadow-4);
		min-width: 10rem;
		z-index: 50;
	}
	.menu-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.375rem 0.75rem;
		font-size: 0.875rem;
		user-select: none;
		transition: all 150ms ease;
		border: 0;
		text-align: left;
		background-color: transparent;
		color: var(--edra-body);
		cursor: pointer;
		outline: none;
	}
	.menu-item:hover, .menu-item:focus {
		background-color: var(--edra-canvas-soft-2);
		color: var(--edra-ink);
	}
	.delete-item {
		color: var(--edra-error);
	}
	.delete-item:hover, .delete-item:focus {
		background-color: var(--edra-error-soft);
		color: var(--edra-error);
	}
	.divider {
		height: 1px;
		background-color: var(--edra-hairline);
		margin-top: 4px;
		margin-bottom: 4px;
	}
	:global(.icon-mute) {
		color: var(--edra-mute) !important;
		width: 1rem;
		height: 1rem;
	}
	:global(.trash-icon) {
		width: 1rem;
		height: 1rem;
	}
</style>
