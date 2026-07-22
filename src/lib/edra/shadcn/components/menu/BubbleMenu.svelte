<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { commands } from '$lib/edra/commands/index.js';
	import {
		addAIHighlight,
		BubbleMenu,
		getEditor,
		isTextSelection,
		useEditorTransaction
	} from '$lib/edra/tiptap/index.js';
	import { cn } from '$lib/utils.js';
	import { WandSparkles } from '@lucide/svelte';
	import Colors from '../tools/Colors.svelte';
	import Tooltip from '../Tooltip.svelte';
	import Link from '../tools/Link.svelte';
	import Lists from '../tools/Lists.svelte';
	import FontSize from '../tools/FontSize.svelte';
	import AlignMent from '../tools/AlignMent.svelte';
	import type { EditorView } from '@tiptap/pm/view';
	import type { EditorState } from '@tiptap/pm/state';
	import type { Editor } from '@tiptap/core';
	interface Props {
		class?: string;
	}
	const { class: className }: Props = $props();

	const editor = getEditor();

	const transaction = useEditorTransaction(editor);
	const commandsKeys = Object.keys(commands).filter(
		(c) => !['media', 'table', 'diagram', 'undo-redo', 'headings'].includes(c)
	);

	function useAI() {
		void transaction.version;
		return editor.extensionManager.extensions.some(
			(e) => e.name === 'ai-highlight' && e.options?.callAI != null
		);
	}

	function isActive(command: (typeof commands)[string][number]): boolean {
		void transaction.version;
		return command.isActive?.(editor) ?? false;
	}
	function isClickable(command: (typeof commands)[string][number]): boolean {
		void transaction.version;
		return command.clickable?.(editor) ?? true;
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
	const shouldShow = (props: {
		editor: Editor;
		element: HTMLElement;
		view: EditorView;
		state: EditorState;
		oldState?: EditorState;
		from: number;
		to: number;
	}) => {
		const { editor: propsEditor, view, state } = props;

		if (!propsEditor || !propsEditor.isEditable) return false;
		if (!view || view.dragging) return false;

		if (propsEditor.isActive('link')) return false;
		if (propsEditor.isActive('codeBlock')) return false;
		if (propsEditor.isActive('image-placeholder')) return false;
		if (propsEditor.isActive('video-placeholder')) return false;
		if (propsEditor.isActive('audio-placeholder')) return false;
		if (propsEditor.isActive('iframe-placeholder')) return false;
		if (propsEditor.isActive('image')) return false;
		if (propsEditor.isActive('video')) return false;
		if (propsEditor.isActive('iframe')) return false;
		if (propsEditor.isActive('audio')) return false;
		if (propsEditor.isActive('blockMath') || propsEditor.isActive('inlineMath')) return false;
		if (propsEditor.isActive('ai-highlight')) return false;
		if (propsEditor.isActive('mermaid')) return false;

		const { selection, doc } = state;
		const { empty, from, to } = selection;

		if (empty) return false;

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
		if (isEmptyTextBlock) return false;

		return true;
	};
</script>

<BubbleMenu
	pluginKey="edra-bubble-menu"
	{editor}
	{shouldShow}
	options={{
		shift: true,
		autoPlacement: {
			allowedPlacements: ['top', 'top-end', 'top-start']
		},
		strategy: 'absolute',
		scrollTarget: editor.view.dom.parentElement ?? window
	}}
	class={cn('flex w-fit items-center rounded-lg border bg-popover', className)}
>
	{#if useAI()}
		<Tooltip tooltip="Use AI">
			<Button
				onmousedown={(e) => {
					e.preventDefault();
					addAIHighlight(editor);
				}}
				variant="ghost"
				size="icon"
			>
				<WandSparkles />
			</Button>
		</Tooltip>
	{/if}
	<Separator orientation="vertical" class="h-4!" />
	{#each commandsKeys as key (key)}
		{@const group = commands[key]}
		{#if key === 'lists'}
			<Lists />
		{:else if key === 'alignment'}
			<AlignMent />
		{:else}
			{#each group as command, idx (idx)}
				{#if command.name === 'paragraph'}
					<span></span>
				{:else if command.name === 'link'}
					<Link />
				{:else}
					{@const Icon = command.icon}
					<Tooltip tooltip={command.tooltip} shortCut={command.shortCut ?? ''}>
						<Button
							variant="ghost"
							size="icon"
							class={cn(isActive(command) && 'bg-muted text-primary')}
							disabled={!isClickable(command)}
							onclick={() => {
								command.onClick?.(editor);
							}}
						>
							<Icon />
						</Button>
					</Tooltip>
				{/if}
			{/each}
			<Separator orientation="vertical" class="h-4!" />
		{/if}
	{/each}
	<FontSize />
	<Colors />
</BubbleMenu>
