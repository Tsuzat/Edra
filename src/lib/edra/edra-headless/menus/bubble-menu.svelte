<script lang="ts">
	import { BubbleMenu } from 'svelte-tiptap';
	import { isTextSelection, type Editor } from '@tiptap/core';
	import { commands } from '../../commands/commands.js';
	import EditorToolIconRenderer from '../components/EditorToolIconRenderer.svelte';
	import type { ShouldShowProps } from './types.js';

	interface Props {
		editor: Editor;
	}
	const { editor }: Props = $props();

	const bubbleMenuCommands = [
		...commands['text-formatting'].commands,
		...commands.alignment.commands,
		...commands.lists.commands
	];

	const colorCommands = commands.colors.commands;
	const fontCommands = commands.fonts.commands;

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
	class="bubble-menu-wrapper"
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
	{#each bubbleMenuCommands as command}
		<EditorToolIconRenderer {command} {editor} />
	{/each}

	<EditorToolIconRenderer command={fontCommands[0]} {editor} />
	<span>{editor.getAttributes('textStyle').fontSize ?? '16px'}</span>
	<EditorToolIconRenderer command={fontCommands[1]} {editor} />

	<EditorToolIconRenderer
		command={colorCommands[0]}
		{editor}
		style={`color: ${editor.getAttributes('textStyle').color};`}
		onclick={() => {
			const color = editor.getAttributes('textStyle').color;
			const hasColor = editor.isActive('textStyle', { color });
			if (hasColor) {
				editor.chain().focus().unsetColor().run();
			} else {
				const color = prompt('Enter the color of the text:');
				if (color !== null) {
					editor.chain().focus().setColor(color).run();
				}
			}
		}}
	/>
	<EditorToolIconRenderer
		command={colorCommands[1]}
		{editor}
		style={`background-color: ${editor.getAttributes('highlight').color};`}
		onclick={() => {
			const hasHightlight = editor.isActive('highlight');
			if (hasHightlight) {
				editor.chain().focus().unsetHighlight().run();
			} else {
				const color = prompt('Enter the color of the highlight:');
				if (color !== null) {
					editor.chain().focus().setHighlight({ color }).run();
				}
			}
		}}
	/>
</BubbleMenu>
