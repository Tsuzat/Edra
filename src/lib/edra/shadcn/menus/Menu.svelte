<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils.js';
	import { isTextSelection } from '@tiptap/core';
	import commands from '../../commands/toolbar-commands.js';
	import BubbleMenu from '../../components/BubbleMenu.svelte';
	import type { EdraToolbarProps, ShouldShowProps } from '../../types.js';
	import ToolBarIcon from '../components/ToolBarIcon.svelte';
	import Alignment from '../components/toolbar/Alignment.svelte';
	import FontSize from '../components/toolbar/FontSize.svelte';
	import Headings from '../components/toolbar/Headings.svelte';
	import Link from '../components/toolbar/Link.svelte';
	import Lists from '../components/toolbar/Lists.svelte';
	import QuickColors from '../components/toolbar/QuickColors.svelte';

	const {
		editor,
		class: className,
		excludedCommands = ['undo-redo', 'media', 'table', 'math'],
		children
	}: EdraToolbarProps = $props();

	const toolbarCommands = Object.keys(commands).filter((key) => !excludedCommands?.includes(key));

	function shouldShow(props: ShouldShowProps) {
		if (!props.editor.isEditable) return false;
		const { view, editor } = props;
		if (!view || editor.view.dragging) {
			return false;
		}
		if (editor.isActive('link')) return false;
		if (editor.isActive('codeBlock')) return false;
		if (editor.isActive('image-placeholder')) return false;
		if (editor.isActive('video-placeholder')) return false;
		if (editor.isActive('audio-placeholder')) return false;
		if (editor.isActive('iframe-placeholder')) return false;
		if (editor.isActive('image')) return false;
		if (editor.isActive('video')) return false;
		if (editor.isActive('iframe')) return false;
		if (editor.isActive('audio')) return false;
		if (editor.isActive('blockMath') || editor.isActive('inlineMath')) return false;
		if (editor.isActive('ai-highlight')) return false;
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
		return !editor.state.selection.empty;
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

<!-- !ISSUE: APPLYING BACKDROP FILTER MESSES WITH POPOVERS IN LINK AND QUICKCOLORS, SO DO NOT APPLY IT -->
<BubbleMenu
	{editor}
	pluginKey="edra-bubble-menu"
	{shouldShow}
	class={cn(
		'edra-bubble-menu bg-popover z-50! flex h-fit w-fit items-center gap-0.5 rounded-lg border p-0',
		className
	)}
	options={{
		shift: true,
		autoPlacement: {
			allowedPlacements: ['top', 'top-end', 'top-start']
		},
		strategy: 'absolute',
		scrollTarget: document.getElementById('edra-editor') ?? undefined
	}}
>
	{#if children}
		{@render children()}
	{:else}
		{#each toolbarCommands.filter((c) => !excludedCommands?.includes(c)) as cmd (cmd)}
			{#if cmd === 'headings'}
				<Headings {editor} />
			{:else if cmd === 'alignment'}
				<Alignment {editor} />
			{:else if cmd === 'lists'}
				<Lists {editor} />
			{:else}
				{@const commandGroup = commands[cmd]}
				{#each commandGroup as command (command)}
					{#if command.name === 'link'}
						<Link {editor} />
					{:else if command.name === 'paragraph'}
						<span></span>
					{:else}
						<ToolBarIcon {editor} {command} />
					{/if}
				{/each}
			{/if}
		{/each}
		<ToolBarIcon {editor} command={commands.math[0]} />
		<FontSize {editor} />
		<QuickColors {editor} />
	{/if}
</BubbleMenu>
