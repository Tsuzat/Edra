<script lang="ts">
	import { commands } from '../../commands/commands.js';
	import type { ShouldShowProps } from '../../utils.js';
	import { isTextSelection, type Editor } from '@tiptap/core';
	import { BubbleMenu } from 'svelte-tiptap';
	import EdraToolBarIcon from '../components/EdraToolBarIcon.svelte';
	import FontSize from '../components/FontSize.svelte';
	import QuickColor from '../components/QuickColor.svelte';

	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();

	const excludeCommands = ['undo-redo', 'media', 'table', 'colors', 'fonts', 'lists'];

	function shouldShow(props: ShouldShowProps) {
		const { view, editor } = props;
		if (!view || editor.view.dragging) {
			return false;
		}
		if (editor.isActive('link')) return false;
		if (editor.isActive('codeBlock')) return false;
		const {
			state: {
				doc,
				selection,
				selection: { empty, from, to }
			}
		} = editor;
		// check if the selection is a table grip
		const domAtPos = view.domAtPos(from || 0).node as HTMLElement;
		const nodeDOM = view.nodeDOM(from || 0) as HTMLElement;
		const node = nodeDOM || domAtPos;

		if (isTableGripSelected(node)) {
			return false;
		}
		// Sometime check for `empty` is not enough.
		// Doubleclick an empty paragraph returns a node size of 2.
		// So we check also for an empty text size.
		const isEmptyTextBlock = !doc.textBetween(from, to).length && isTextSelection(selection);
		if (empty || isEmptyTextBlock || !editor.isEditable) {
			return false;
		}
		return true;
	}

	const isTableGripSelected = (node: HTMLElement) => {
		let container = node;
		while (container && !['TD', 'TH'].includes(container.tagName)) {
			container = container.parentElement!;
		}
		const gripColumn =
			container && container.querySelector && container.querySelector('a.grip-column.selected');
		const gripRow =
			container && container.querySelector && container.querySelector('a.grip-row.selected');
		if (gripColumn || gripRow) {
			return true;
		}
		return false;
	};
</script>

<BubbleMenu
	{editor}
	class="flex h-fit w-fit items-center gap-1 rounded-md border bg-background/90 p-0.5 backdrop-blur-md"
	{shouldShow}
	pluginKey="bubble-menu"
	updateDelay={100}
	tippyOptions={{
		popperOptions: {
			placement: 'top-start',
			modifiers: [
				{
					name: 'preventOverflow',
					options: {
						boundary: 'viewport',
						padding: 8
					}
				},
				{
					name: 'flip',
					options: {
						fallbackPlacements: ['bottom-start', 'top-end', 'bottom-end']
					}
				}
			]
		},
		maxWidth: 'calc(100vw - 16px)'
	}}
>
	{#each Object.keys(commands).filter((key) => !excludeCommands.includes(key)) as keys}
		{@const groups = commands[keys].commands}
		{#each groups as command}
			<EdraToolBarIcon {command} {editor} />
		{/each}
	{/each}
	<FontSize {editor} />
	<QuickColor {editor} />
</BubbleMenu>
