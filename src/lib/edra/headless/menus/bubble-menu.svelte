<script lang="ts">
	import { BubbleMenu } from 'svelte-tiptap';
	import { isTextSelection, type Editor } from '@tiptap/core';
	import { commands } from '../../commands/commands.js';
	import EdraToolBarIcon from '../components/EdraToolBarIcon.svelte';
	import type { ShouldShowProps } from '../../utils.js';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		editor: Editor;
		children?: Snippet<[]>;
	}
	const { class: className = '', editor, children }: Props = $props();

	let isDragging = $state(false);

	editor.view.dom.addEventListener('dragstart', () => {
		isDragging = true;
	});

	editor.view.dom.addEventListener('drop', () => {
		isDragging = true;

		// Allow some time for the drop action to complete before re-enabling
		setTimeout(() => {
			isDragging = false;
		}, 100); // Adjust delay if needed
	});

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
		return !isDragging && !editor.state.selection.empty;
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
	class={`bubble-menu-wrapper ${className}`}
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
	{#if children}
		{@render children()}
	{:else}
		{#each bubbleMenuCommands as command}
			<EdraToolBarIcon {command} {editor} />
		{/each}

		<EdraToolBarIcon command={fontCommands[0]} {editor} />
		<span>{editor.getAttributes('textStyle').fontSize ?? '16px'}</span>
		<EdraToolBarIcon command={fontCommands[1]} {editor} />

		<EdraToolBarIcon
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
		<EdraToolBarIcon
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
	{/if}
</BubbleMenu>
