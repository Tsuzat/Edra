<script lang="ts">
	import { autoPlacement } from '@floating-ui/dom';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
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
	import { commands, type EdraCommand } from '../commands/index.ts';
	import { quickcolors } from '../utils.ts';
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
		/**
		 * !FIXME: document.execCommand is deprecated, use navigator.clipboard.writeText instead
		 */
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
			.setAIHighlight({ color: 'var(--color-muted)' })
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

<div bind:this={element} class={cn('z-0!', className)} style="visibility: hidden;">
	<Button
		variant="ghost"
		class="z-0! size-7! rounded-sm opacity-60 hover:opacity-100 focus-visible:opacity-100 active:opacity-100"
		onclick={() => (open = !open)}
	>
		<GripVertical />
	</Button>
	{#if type === 'extended'}
		<DropdownMenu.Root bind:open>
			<DropdownMenu.Trigger class="sr-only">
				<span>Drag Handle</span>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-fit" portalProps={{ to: element }}>
				<DropdownMenu.Group>
					<DropdownMenu.GroupHeading class="text-muted-foreground capitalize">
						{currentNode?.type.name}
					</DropdownMenu.GroupHeading>
					{#if useAI()}
						<DropdownMenu.Item onmousedown={(e) => e.preventDefault()} onclick={handleAIHighlight}>
							<Sparkles />
							<span
								class="bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text font-bold text-transparent"
							>
								Edit With AI</span
							>
						</DropdownMenu.Item>
					{/if}
					<DropdownMenu.Sub>
						<DropdownMenu.SubTrigger openDelay={300}>
							<Repeat2 />
							Turn Into
						</DropdownMenu.SubTrigger>
						<DropdownMenu.SubContent
							class="max-h-96 w-fit overflow-y-scroll rounded-lg duration-300"
						>
							{#each Object.entries(turnIntos) as [key, turnIntoCommands] (key)}
								<DropdownMenu.Group>
									<DropdownMenu.Label class="capitalize">{key}</DropdownMenu.Label>
									{#each turnIntoCommands as command (command)}
										{@const Icon = command.icon}
										<DropdownMenu.Item
											onclick={() => {
												if (currentNode && currentNodePos && editor)
													command.turnInto?.(editor, currentNode, currentNodePos);
											}}
										>
											<Icon />
											<span>{command.tooltip}</span>
											{#if command.shortCut}
												<DropdownMenu.Shortcut class="rounded border bg-background p-0.5"
													>{command.shortCut}</DropdownMenu.Shortcut
												>
											{/if}
										</DropdownMenu.Item>
									{/each}
									{#if key !== Object.keys(turnIntos).at(-1)}
										<DropdownMenu.Separator />
									{/if}
								</DropdownMenu.Group>
							{/each}
						</DropdownMenu.SubContent>
					</DropdownMenu.Sub>
				</DropdownMenu.Group>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger openDelay={300}>
						<Palette />
						Colors
					</DropdownMenu.SubTrigger>
					<DropdownMenu.Content
						side="right"
						class="max-h-96 min-w-fit overflow-auto rounded-lg duration-300"
					>
						<DropdownMenu.Group>
							<DropdownMenu.Label>Texts</DropdownMenu.Label>
							{#each quickcolors as color (color.label)}
								<DropdownMenu.Item
									title={color.value}
									onclick={() => {
										if (color.value === '' || color.label === 'Default')
											editor?.chain().setNodeSelection(currentNodePos).unsetColor().run();
										else
											editor?.chain().setNodeSelection(currentNodePos).setColor(color.value).run();
									}}
								>
									<span style={`color: ${color.value};`}>A</span>
									<span class="capitalize">{color.label}</span>
								</DropdownMenu.Item>
							{/each}
						</DropdownMenu.Group>
						<DropdownMenu.Separator />
						<DropdownMenu.Group class="min-w-fit">
							<DropdownMenu.Label>Background</DropdownMenu.Label>
							{#each quickcolors as color (color.label)}
								<DropdownMenu.Item
									title={color.value}
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
									<span
										class="size-4 rounded-full border"
										style={`background-color: ${`${color.value}50`};`}
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
						AlignMent
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						<DropdownMenu.Label>Alignments</DropdownMenu.Label>
						{#each alignments as alignment (alignment)}
							{@const Icon = alignment.icon}
							<DropdownMenu.Item
								onclick={() => {
									if (currentNode && currentNodePos && editor)
										alignment.turnInto?.(editor, currentNode, currentNodePos);
								}}
							>
								<Icon />
								{alignment.tooltip}
								<DropdownMenu.Shortcut class="rounded border bg-background p-0.5">
									{alignment.shortCut}
								</DropdownMenu.Shortcut>
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
				<DropdownMenu.Separator />
				<DropdownMenu.Item onclick={insertNode}>
					<Plus />
					Insert Next
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={handleRemoveFormatting}>
					<RemoveFormatting />
					Remove Formatting
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item onclick={handleDuplicate}>
					<Duplicate />
					Duplicate
				</DropdownMenu.Item>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>
						<Clipboard />
						Copy to Clipboard
					</DropdownMenu.SubTrigger>
					<DropdownMenu.Content side="right">
						<DropdownMenu.Label>Copy as</DropdownMenu.Label>
						<DropdownMenu.Item onclick={handleCopyToClipboard}>
							<Clipboard />
							Copy Content
						</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => handleCopyContentAs('markdown')}>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"
								><path
									fill="currentColor"
									d="M2.491 4.046a.75.75 0 0 1 .83.218L7 8.592l3.678-4.328A.75.75 0 0 1 12 4.75v9.5a.75.75 0 0 1-1.5 0V6.79l-2.929 3.446a.75.75 0 0 1-1.142 0L3.5 6.79v7.46a.75.75 0 0 1-1.5 0v-9.5a.75.75 0 0 1 .491-.704M13.22 11.72a.75.75 0 0 1 1.06 0l.72.72V4.75a.75.75 0 0 1 1.5 0v7.69l.72-.72a.75.75 0 1 1 1.06 1.06l-2 2a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 0 1 0-1.06"
								/></svg
							>
							Copy as Markdown
						</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => handleCopyContentAs('json')}>
							<Braces />
							Copy as JSON
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Sub>
				<DropdownMenu.Separator />
				<DropdownMenu.Item onclick={handleDelete}>
					<Delete class="text-destructive" />
					Delete
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/if}
</div>
