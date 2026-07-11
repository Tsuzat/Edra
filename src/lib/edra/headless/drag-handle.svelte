<script lang="ts">
	import { autoPlacement } from '@floating-ui/dom';
	import {
		Root,
		Trigger,
		Content,
		Label,
		Item,
		Shortcut,
		Separator,
		Sub,
		SubTrigger,
		SubContent
	} from './primitives/dropdown/index.ts';
	import { Braces, Sparkles, TextAlignCenter } from '@lucide/svelte';
	import Clipboard from '@lucide/svelte/icons/clipboard';
	import Duplicate from '@lucide/svelte/icons/copy';
	import GripVertical from '@lucide/svelte/icons/grip-vertical';
	import Palette from '@lucide/svelte/icons/palette';
	import Plus from '@lucide/svelte/icons/plus';
	import RemoveFormatting from '@lucide/svelte/icons/remove-formatting';
	import Repeat2 from '@lucide/svelte/icons/repeat-2';
	import Delete from '@lucide/svelte/icons/trash-2';
	import type { Editor } from '@tiptap/core';
	import { DragHandlePlugin } from '@tiptap/extension-drag-handle';
	import type { Node } from '@tiptap/pm/model';
	import { NodeSelection } from '@tiptap/pm/state';
	import { onMount } from 'svelte';
	import { commands, type EdraCommand } from '../commands/index.js';
	import { quickcolors } from '../utils.js';
	import { getEditor, useEditorTransaction } from '../tiptap/index.ts';
	import { cn } from '$lib/utils.js';

	interface Props {
		type?: 'simple' | 'extended';
		class?: string;
	}
	const { type = 'simple', class: className }: Props = $props();

	const alignments = commands.alignment;
	const turnIntos: Record<string, EdraCommand[]> = Object.entries(commands).reduce(
		(acc, [key, value]) => {
			if (key === 'alignment') return acc;
			const turnIntoCommands = value.filter((c) => c.turnInto);
			if (turnIntoCommands.length > 0) {
				acc[key] = turnIntoCommands;
			}
			return acc;
		},
		{} as Record<string, EdraCommand[]>
	);

	let currentNode: Node | null = $state(null);
	let currentNodePos: number = $state(-1);
	let open = $state(false);

	const pluginKey = 'globalDragHandle';
	let element = $state(document.createElement('div'));

	const editor = getEditor();
	const transaction = useEditorTransaction(editor);

	function useAI() {
		void transaction.version;
		return editor.extensionManager.extensions.some(
			(e) => e.name === 'ai-highlight' && e.options?.callAI != null
		);
	}

	onMount(() => {
		const plugin = DragHandlePlugin({
			element,
			pluginKey,
			editor,
			computePositionConfig: {
				strategy: 'absolute',
				middleware: [
					autoPlacement({
						allowedPlacements: ['left', 'left-start']
					})
				]
			},
			nestedOptions: {
				enabled: false,
				rules: [],
				defaultRules: true,
				allowedContainers: undefined,
				edgeDetection: {
					threshold: 1,
					edges: ['left', 'top'],
					strength: 1
				}
			},
			onNodeChange
		});
		editor?.registerPlugin(plugin.plugin);
		return () => editor?.unregisterPlugin(pluginKey);
	});

	const onNodeChange = (data: { editor: Editor; node: Node | null; pos: number }) => {
		if (data.node) currentNode = data.node;
		currentNodePos = data.pos;
	};

	const handleRemoveFormatting = () => {
		const chain = editor?.chain();
		chain?.setNodeSelection(currentNodePos).unsetAllMarks();
		chain?.setParagraph();
		chain?.run();
	};

	const handleDuplicate = () => {
		editor?.commands.setNodeSelection(currentNodePos);
		const selectedNode =
			editor?.state.selection.$anchor.node(1) || (editor?.state.selection as NodeSelection).node;
		editor
			?.chain()
			.setMeta('hideDragHandle', true)
			.insertContentAt(currentNodePos + (currentNode?.nodeSize || 0), selectedNode.toJSON())
			.run();
	};

	const handleCopyToClipboard = () => {
		editor?.chain().setMeta('hideDragHandle', true).setNodeSelection(currentNodePos).run();
		document.execCommand('copy');
	};

	const handleCopyContentAs = (as: 'markdown' | 'json') => {
		let data = '';
		let nodeData = currentNode?.toJSON();
		if (as === 'markdown') {
			data = editor?.markdown?.serialize(nodeData) || '';
		} else if (as === 'json') {
			data = JSON.stringify(nodeData, null, 2) || '';
		}
		if (data) {
			navigator.clipboard.writeText(data);
		}
	};

	const handleDelete = () => {
		editor
			?.chain()
			.setMeta('hideDragHandle', true)
			.setNodeSelection(currentNodePos)
			.deleteSelection()
			.run();
	};

	function handleAIHighlight() {
		if (currentNodePos === -1) return;
		editor
			.chain()
			.setNodeSelection(currentNodePos)
			.setAIHighlight({ color: 'var(--edra-canvas-soft-2)' })
			.run();
	}

	const insertNode = () => {
		if (currentNodePos === -1) return;
		const currentNodeSize = currentNode?.nodeSize || 0;
		const insertPos = currentNodePos + currentNodeSize;
		const currentNodeIsEmptyParagraph =
			currentNode?.type.name === 'paragraph' && currentNode?.content?.size === 0;
		const focusPos = currentNodeIsEmptyParagraph ? currentNodePos + 2 : insertPos + 2;
		editor
			?.chain()
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

<div bind:this={element} class={cn('drag-handle-container', className)} style="visibility: hidden;">
	{#if type === 'extended'}
		<Root bind:open>
			<Trigger class="edra-btn edra-btn-ghost trigger-btn">
				<GripVertical class="drag-icon" />
			</Trigger>
			<Content class="menu-content">
				<Label class="label-text">
					{currentNode?.type.name}
				</Label>
				{#if useAI()}
					<Item onclick={handleAIHighlight}>
						<Sparkles class="drag-icon" />
						<span class="text-ink font-bold">Edit With AI</span>
					</Item>
				{/if}
				<Sub>
					<SubTrigger>
						<Repeat2 class="drag-icon" />
						<span>Turn Into</span>
					</SubTrigger>
					<SubContent class="sub-menu-scroll">
						{#each Object.entries(turnIntos) as [key, turnIntoCommands] (key)}
							<Label class="capitalize-text">{key}</Label>
							{#each turnIntoCommands as command (command)}
								{@const Icon = command.icon}
								<Item
									onclick={() => {
										if (currentNode && currentNodePos && editor)
											command.turnInto?.(editor, currentNode, currentNodePos);
									}}
								>
									<Icon class="drag-icon" />
									<span>{command.tooltip}</span>
									{#if command.shortCut}
										<Shortcut>{command.shortCut}</Shortcut>
									{/if}
								</Item>
							{/each}
							{#if key !== Object.keys(turnIntos).at(-1)}
								<Separator />
							{/if}
						{/each}
					</SubContent>
				</Sub>
				<Sub>
					<SubTrigger>
						<Palette class="drag-icon" />
						<span>Colors</span>
					</SubTrigger>
					<SubContent class="sub-menu-scroll">
						<Label>Texts</Label>
						{#each quickcolors as color (color.label)}
							<Item
								onclick={() => {
									if (color.value === '' || color.label === 'Default')
										editor?.chain().setNodeSelection(currentNodePos).unsetColor().run();
									else editor?.chain().setNodeSelection(currentNodePos).setColor(color.value).run();
								}}
							>
								<span style={`color: ${color.value}; font-weight: bold;`}>A</span>
								<span class="capitalize-text">{color.label}</span>
							</Item>
						{/each}
						<Separator />
						<Label>Background</Label>
						{#each quickcolors as color (color.label)}
							<Item
								onclick={() => {
									if (color.value === '' || color.label === 'Default')
										editor?.chain().setNodeSelection(currentNodePos).unsetHighlight().run();
									else
										editor
											?.chain()
											.setNodeSelection(currentNodePos)
											.setHighlight({ color: `${color.value}50` })
											.run();
								}}
							>
								<span class="color-circle" style={`background-color: ${`${color.value}50`};`}
								></span>
								<span class="capitalize-text">{color.label}</span>
							</Item>
						{/each}
					</SubContent>
				</Sub>
				<Sub>
					<SubTrigger>
						<TextAlignCenter class="drag-icon" />
						<span>AlignMent</span>
					</SubTrigger>
					<SubContent>
						<Label>Alignments</Label>
						{#each alignments as alignment (alignment)}
							{@const Icon = alignment.icon}
							<Item
								onclick={() => {
									if (currentNode && currentNodePos && editor)
										alignment.turnInto?.(editor, currentNode, currentNodePos);
								}}
							>
								<Icon class="drag-icon" />
								<span>{alignment.tooltip}</span>
								<Shortcut>{alignment.shortCut}</Shortcut>
							</Item>
						{/each}
					</SubContent>
				</Sub>
				<Separator />
				<Item onclick={insertNode}>
					<Plus class="drag-icon" />
					<span>Insert Next</span>
				</Item>
				<Item onclick={handleRemoveFormatting}>
					<RemoveFormatting class="drag-icon" />
					<span>Remove Formatting</span>
				</Item>
				<Separator />
				<Item onclick={handleDuplicate}>
					<Duplicate class="drag-icon" />
					<span>Duplicate</span>
				</Item>
				<Sub>
					<SubTrigger>
						<Clipboard class="drag-icon" />
						<span>Copy to Clipboard</span>
					</SubTrigger>
					<SubContent>
						<Label>Copy as</Label>
						<Item onclick={handleCopyToClipboard}>
							<Clipboard class="drag-icon" />
							<span>Copy Content</span>
						</Item>
						<Item onclick={() => handleCopyContentAs('markdown')}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 20 20"
								class="drag-icon"
								><path
									fill="currentColor"
									d="M2.491 4.046a.75.75 0 0 1 .83.218L7 8.592l3.678-4.328A.75.75 0 0 1 12 4.75v9.5a.75.75 0 0 1-1.5 0V6.79l-2.929 3.446a.75.75 0 0 1-1.142 0L3.5 6.79v7.46a.75.75 0 0 1-1.5 0v-9.5a.75.75 0 0 1 .491-.704M13.22 11.72a.75.75 0 0 1 1.06 0l.72.72V4.75a.75.75 0 0 1 1.5 0v7.69l.72-.72a.75.75 0 1 1 1.06 1.06l-2 2a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 0 1 0-1.06"
								/></svg
							>
							<span>Copy as Markdown</span>
						</Item>
						<Item onclick={() => handleCopyContentAs('json')}>
							<Braces class="drag-icon" />
							<span>Copy as JSON</span>
						</Item>
					</SubContent>
				</Sub>
				<Separator />
				<Item onclick={handleDelete} class="delete-item">
					<Delete class="drag-icon" />
					<span>Delete</span>
				</Item>
			</Content>
		</Root>
	{:else}
		<button class="edra-btn edra-btn-ghost trigger-btn">
			<GripVertical class="drag-icon" />
		</button>
	{/if}
</div>

<style>
	.drag-handle-container {
		position: relative;
		z-index: 0 !important;
	}
	:global(.trigger-btn) {
		width: 1.75rem !important;
		height: 1.75rem !important;
		border-radius: var(--edra-radius-sm);
		opacity: 0.6;
		transition: opacity 150ms ease;
	}
	:global(.trigger-btn):hover,
	:global(.trigger-btn):focus-visible,
	:global(.trigger-btn):active {
		opacity: 1;
	}
	:global(.menu-content) {
		width: fit-content;
		min-width: 10rem;
		padding: 4px;
	}
	:global(.label-text) {
		color: var(--edra-mute);
		font-size: 0.75rem;
		text-transform: capitalize;
	}
	.text-ink {
		color: var(--edra-ink);
	}
	.font-bold {
		font-weight: 700;
	}
	:global(.sub-menu-scroll) {
		width: fit-content;
		max-height: 24rem;
		overflow-y: scroll;
		transition:
			opacity 150ms ease,
			background-color 150ms ease,
			transform 150ms ease;
		border-radius: var(--edra-radius-lg);
	}
	.color-circle {
		width: 1rem;
		height: 1rem;
		border-radius: var(--edra-radius-pill);
		display: inline-block;
		border: 1px solid var(--edra-border);
	}
	:global(.delete-item) {
		color: var(--edra-error) !important;
	}
	:global(.delete-item):hover {
		background-color: var(--edra-error-soft) !important;
	}
	.capitalize-text {
		text-transform: capitalize;
	}
	:global(.drag-icon) {
		width: 1rem;
		height: 1rem;
	}
</style>
