<script lang="ts">
	import { isTextSelection, type Editor } from '@tiptap/core';
	import { BubbleMenu } from 'svelte-tiptap';
	import FontSize from '../icons/font-size.svelte';
	import Bold from '../icons/bold.svelte';
	import Italic from '../icons/italic.svelte';
	import Underline from '../icons/underline.svelte';
	import Strikethrough from '../icons/strikethrough.svelte';
	import Textalign from '../icons/textalign.svelte';
	import Superscript from '../icons/superscript.svelte';
	import Subscript from '../icons/subscript.svelte';
	import type { ShouldShowProps } from './types.js';
	import Link from '../icons/link.svelte';
	import ButtleList from '../icons/buttle-list.svelte';
	import OrderedList from '../icons/ordered-list.svelte';
	import TaskList from '../icons/task-list.svelte';
	import BlockQuote from '../icons/block-quote.svelte';
	import Code from '../icons/code.svelte';
	import Quickcolor from '../icons/quickcolor.svelte';
	import CodeBlock from '../icons/code-block.svelte';

	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();
	const toolTipProps = { delayDuration: 0, disabled: true };

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
	<FontSize {editor} {toolTipProps} />
	<Textalign {editor} {toolTipProps} />
	<Quickcolor {editor} {toolTipProps} />
	<Link {editor} {toolTipProps} />
	<CodeBlock {editor} {toolTipProps} />
	<Bold {editor} {toolTipProps} />
	<Italic {editor} {toolTipProps} />
	<Underline {editor} {toolTipProps} />
	<Strikethrough {editor} {toolTipProps} />
	<BlockQuote {editor} {toolTipProps} />
	<Code {editor} {toolTipProps} />
	<Superscript {editor} {toolTipProps} />
	<Subscript {editor} {toolTipProps} />
	<ButtleList {editor} {toolTipProps} />
	<OrderedList {editor} {toolTipProps} />
	<TaskList {editor} {toolTipProps} />
</BubbleMenu>
