<script lang="ts">
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import ArrowDownFromLine from '@lucide/svelte/icons/arrow-down-from-line';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import ArrowUpFromLine from '@lucide/svelte/icons/arrow-up-from-line';
	import Sheet from '@lucide/svelte/icons/sheet';
	import Trash from '@lucide/svelte/icons/trash';
	import {
		isRowGripSelected,
		moveRowDown,
		moveRowUp
	} from '../../../tiptap/extensions/table/utils.js';
	import { BubbleMenu, getEditor } from '$lib/edra/tiptap/index.js';
	import strings from '../../../strings.js';

	const editor = getEditor();
</script>

<BubbleMenu
	{editor}
	pluginKey="table-row-menu"
	shouldShow={(props) => {
		const { editor: propsEditor, state, view, from } = props;
		if (!propsEditor || !propsEditor.isEditable) return false;
		if (!state) return false;
		return isRowGripSelected({ editor: propsEditor, view, state, from });
	}}
	options={{
		shift: true,
		autoPlacement: {
			allowedPlacements: ['top', 'bottom']
		},
		strategy: 'absolute',
		scrollTarget: editor.view.dom.parentElement ?? window
	}}
	class="table-menu"
>
	<button
		class="menu-item"
		title={strings.menu.table.headerRow}
		onclick={() => editor.chain().focus().toggleHeaderRow().run()}
	>
		<Sheet class="icon-mute" />
		<span>{strings.menu.table.headerRow}</span>
	</button>
	<div class="divider"></div>
	<button
		class="menu-item"
		title={strings.menu.table.addRowAfter}
		onclick={() => editor.chain().focus().addRowAfter().run()}
	>
		<ArrowDownFromLine class="icon-mute" />
		<span>{strings.menu.table.addRowAfter}</span>
	</button>
	<button
		class="menu-item"
		title={strings.menu.table.addRowBefore}
		onclick={() => editor.chain().focus().addRowBefore().run()}
	>
		<ArrowUpFromLine class="icon-mute" />
		<span>{strings.menu.table.addRowBefore}</span>
	</button>
	<div class="divider"></div>
	<button
		class="menu-item"
		title={strings.menu.table.moveRowUp}
		onclick={() => editor.view.dispatch(moveRowUp(editor.state.tr))}
	>
		<ArrowUp class="icon-mute" />
		<span>{strings.menu.table.moveRowUp}</span>
	</button>
	<button
		class="menu-item"
		title={strings.menu.table.moveRowDown}
		onclick={() => editor.view.dispatch(moveRowDown(editor.state.tr))}
	>
		<ArrowDown class="icon-mute" />
		<span>{strings.menu.table.moveRowDown}</span>
	</button>
	<div class="divider"></div>
	<button
		class="menu-item delete-item"
		title={strings.menu.table.deleteRow}
		data-variant="destructive"
		onclick={() => editor.chain().focus().deleteRow().run()}
	>
		<Trash class="trash-icon" />
		<span>{strings.menu.table.deleteRow}</span>
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
	.menu-item:hover,
	.menu-item:focus {
		background-color: var(--edra-canvas-soft-2);
		color: var(--edra-ink);
	}
	.delete-item {
		color: var(--edra-error);
	}
	.delete-item:hover,
	.delete-item:focus {
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
