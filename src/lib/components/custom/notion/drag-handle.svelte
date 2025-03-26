<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { onMount } from 'svelte';
	import GripVertical from 'lucide-svelte/icons/grip-vertical';
	import { DragHandlePlugin } from '$lib/edra/extensions/drag-handle/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Plus from 'lucide-svelte/icons/plus';
	import type { Node } from '@tiptap/pm/model';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import RemoveFormatting from 'lucide-svelte/icons/remove-formatting';
	import Duplicate from 'lucide-svelte/icons/copy';
	import Clipboard from 'lucide-svelte/icons/clipboard';
	import Delete from 'lucide-svelte/icons/trash-2';
	import { NodeSelection } from '@tiptap/pm/state';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();

	let currentNode: Node | null = $state(null);
	let currentNodePos: number = $state(-1);
	let open = $state(false);

	const pluginKey = 'globalDragHandle';

	onMount(() => {
		const plugin = DragHandlePlugin({
			pluginKey: pluginKey,
			dragHandleWidth: 55,
			scrollTreshold: 100,
			dragHandleSelector: '.drag-handle',
			excludedTags: ['pre', 'code', 'table p'],
			customNodes: [],
			onMouseMove: onMouseMove
		});
		editor.registerPlugin(plugin);
		return () => editor.unregisterPlugin(pluginKey);
	});

	const onMouseMove = (data: { node: Node; pos: number }) => {
		if (data.node) currentNode = data.node;
		currentNodePos = data.pos;
	};

	const handleAddNode = () => {
		if (currentNodePos !== -1) {
			const currentNodeSize = currentNode?.nodeSize || 0;
			const insertPos = currentNodePos + currentNodeSize;
			const currentNodeIsEmptyParagraph =
				currentNode?.type.name === 'paragraph' && currentNode?.content?.size === 0;
			const focusPos = currentNodeIsEmptyParagraph ? currentNodePos + 2 : insertPos + 2;
			editor
				.chain()
				.command(({ dispatch, tr, state }) => {
					if (dispatch) {
						if (currentNodeIsEmptyParagraph) {
							tr.insertText('/', currentNodePos, currentNodePos + 1);
						} else {
							tr.insert(
								insertPos,
								state.schema.nodes.paragraph.create(null, [state.schema.text('/')])
							);
						}

						return dispatch(tr);
					}

					return true;
				})
				.focus(focusPos)
				.run();
		}
	};

	const handleRemoveFormatting = () => {
		const chain = editor.chain();
		chain.setNodeSelection(currentNodePos).unsetAllMarks();
		if (currentNode?.type.name !== 'paragraph') {
			chain.setParagraph();
		}
		chain.run();
	};

	const handleDuplicate = () => {
		editor.commands.setNodeSelection(currentNodePos);
		const selectedNode =
			editor.state.selection.$anchor.node(1) || (editor.state.selection as NodeSelection).node;
		editor
			.chain()
			.setMeta('hideDragHandle', true)
			.insertContentAt(currentNodePos + (currentNode?.nodeSize || 0), selectedNode.toJSON())
			.run();
	};

	const handleCopyToClipboard = () => {
		editor.chain().setMeta('hideDragHandle', true).setNodeSelection(currentNodePos).run();
		/**
		 * !FIXME: document.execCommand is deprecated, use navigator.clipboard.writeText instead
		 */
		document.execCommand('copy');
	};

	const handleDelete = () => {
		editor
			.chain()
			.setMeta('hideDragHandle', true)
			.setNodeSelection(currentNodePos)
			.deleteSelection()
			.run();
	};
</script>

<div class="drag-handle z-50">
	<Button variant="ghost" class="size-6 rounded-sm p-0" onclick={handleAddNode}>
		<Plus />
	</Button>
	<Button variant="ghost" class="size-6 rounded-sm p-0" onclick={() => (open = !open)}>
		<GripVertical />
	</Button>
	<DropdownMenu.Root bind:open>
		<DropdownMenu.Trigger class="sr-only">
			<span>Show Drag</span>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-fit rounded-md bg-popover p-2">
			<DropdownMenu.Item onclick={handleRemoveFormatting}>
				<RemoveFormatting />
				Remove Formatting
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={handleDuplicate}>
				<Duplicate />
				Duplicate Node
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={handleCopyToClipboard}>
				<Clipboard />
				Copy to clipboard
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={handleDelete} class="text-destructive">
				<Delete />
				Delete Node
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
