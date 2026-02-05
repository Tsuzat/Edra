<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { TextAlignCenter } from '@lucide/svelte';
	import Clipboard from '@lucide/svelte/icons/clipboard';
	import Duplicate from '@lucide/svelte/icons/copy';
	import GripVertical from '@lucide/svelte/icons/grip-vertical';
	import Palette from '@lucide/svelte/icons/palette';
	import Plus from '@lucide/svelte/icons/plus';
	import RemoveFormatting from '@lucide/svelte/icons/remove-formatting';
	import Repeat2 from '@lucide/svelte/icons/repeat-2';
	import Delete from '@lucide/svelte/icons/trash-2';
	import type { Editor } from '@tiptap/core';
	import { DragHandlePlugin } from '../extensions/drag-handle/index.js';
	import type { Node } from '@tiptap/pm/model';
	import { NodeSelection } from '@tiptap/pm/state';
	import { onMount } from 'svelte';
	import commands from '../commands/toolbar-commands.js';
	import { quickcolors } from '../utils.js';
	import strings from '../strings.js';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();

	const alignments = commands['alignment'];

	let currentNode: Node | null = $state(null);
	let currentNodePos: number = $state(-1);
	let open = $state(false);

	const pluginKey = 'globalDragHandle';
	let element = $state(document.createElement('div'));

	const turnIntoCommand = Object.values(commands)
		.flat()
		.filter((c) => c.turnInto !== undefined);
	let editorElement: HTMLElement | null = $state(null);

	onMount(() => {
		const plugin = DragHandlePlugin({
			pluginKey: pluginKey,
			dragHandleWidth: 20,
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

	const handleRemoveFormatting = () => {
		const chain = editor.chain();
		chain.setNodeSelection(currentNodePos).unsetAllMarks();
		chain.setParagraph();
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

	const insertNode = () => {
		if (currentNodePos === -1) return;
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
	};
</script>

<div bind:this={element} class="drag-handle">
	<Button variant="ghost" class="size-6! rounded-sm p-0" onclick={() => (open = true)}>
		<GripVertical />
	</Button>
	<DropdownMenu.Root bind:open>
		<DropdownMenu.Trigger class="sr-only">
			<span>{strings.dragHandle.title}</span>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content portalProps={{ to: editorElement ?? undefined }}>
			<DropdownMenu.Group>
				<DropdownMenu.GroupHeading class="text-muted-foreground capitalize">
					{currentNode?.type.name}
				</DropdownMenu.GroupHeading>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger openDelay={300}>
						<Repeat2 />
						{strings.dragHandle.turnInto}
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent class="max-h-96 overflow-auto duration-300">
						{#each turnIntoCommand as command (command)}
							{@const Icon = command.icon}
							<DropdownMenu.Item
								onclick={() => {
									if (currentNode && currentNodePos)
										command.turnInto?.(editor, currentNode, currentNodePos);
								}}
							>
								<Icon />
								<span>{command.tooltip}</span>
								<DropdownMenu.Shortcut class="bg-background rounded border p-0.5"
									>{command.shortCut}</DropdownMenu.Shortcut
								>
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
			</DropdownMenu.Group>
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger openDelay={300}>
					<Palette />
					{strings.toolbar.color.buttonTitle}
				</DropdownMenu.SubTrigger>
				<DropdownMenu.Content side="right" class="max-h-96 overflow-auto duration-300">
					<DropdownMenu.Group>
						<DropdownMenu.Label class="text-muted-foreground text-sm"
							>{strings.toolbar.color.textColor}</DropdownMenu.Label
						>
						{#each quickcolors as color (color.label)}
							<DropdownMenu.Item
								title={color.label}
								onclick={() => {
									if (color.value === '' || color.label === strings.toolbar.color.default)
										editor.chain().setNodeSelection(currentNodePos).unsetColor().run();
									else editor.chain().setNodeSelection(currentNodePos).setColor(color.value).run();
								}}
							>
								<span style={`color: ${color.value};`}
									>{strings.toolbar.color.templateCharacter}</span
								>
								<span class="capitalize">{color.label}</span>
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.Group>
					<DropdownMenu.Separator />
					<DropdownMenu.Group>
						<DropdownMenu.Label class="text-muted-foreground text-sm"
							>{strings.toolbar.color.highlightColor}</DropdownMenu.Label
						>
						<!-- {@const currentHighlight = editor.getAttributes('highlight').color as string} -->
						{#each quickcolors as color (color.label)}
							<DropdownMenu.Item
								title={color.label}
								onclick={() => {
									if (color.value === '' || color.label === strings.toolbar.color.default)
										editor.chain().setNodeSelection(currentNodePos).unsetHighlight().run();
									else
										editor
											.chain()
											.setNodeSelection(currentNodePos)
											.setHighlight({ color: color.value })
											.run();
								}}
							>
								<span class="size-4 rounded-full border" style={`background-color: ${color.value};`}
								></span>
								<span class="capitalize">{color.label}</span>
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Sub>
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger openDelay={300}>
					<TextAlignCenter />
					{strings.toolbar.alignment.buttonTitle}
				</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent>
					<DropdownMenu.Label>{strings.toolbar.alignment.dropdownTitle}</DropdownMenu.Label>
					{#each alignments as alignment (alignment)}
						{@const Icon = alignment.icon}
						<DropdownMenu.Item
							onclick={() => {
								if (currentNode && currentNodePos)
									alignment.turnInto?.(editor, currentNode, currentNodePos);
							}}
						>
							<Icon />
							{alignment.tooltip}
							<DropdownMenu.Shortcut>
								{alignment.shortCut}
							</DropdownMenu.Shortcut>
						</DropdownMenu.Item>
					{/each}
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
			<DropdownMenu.Separator />
			<DropdownMenu.Item onclick={insertNode}>
				<Plus />
				{strings.dragHandle.insertNext}
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={handleRemoveFormatting}>
				<RemoveFormatting />
				{strings.dragHandle.removeFormatting}
			</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item onclick={handleDuplicate}>
				<Duplicate />
				{strings.dragHandle.duplicate}
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={handleCopyToClipboard}>
				<Clipboard />
				{strings.dragHandle.copy}
			</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item onclick={handleDelete}>
				<Delete class="text-destructive" />
				{strings.dragHandle.delete}
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
