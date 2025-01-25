<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { NodeViewWrapper } from 'svelte-tiptap';
	import type { NodeViewProps } from '@tiptap/core';
	import { cn } from '$lib/utils.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import {
		AlignCenter,
		AlignLeft,
		AlignRight,
		EllipsisVertical,
		CopyIcon,
		Fullscreen,
		Trash,
		Captions
	} from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { duplicateContent } from './utils.js';

	const { node, editor, selected, deleteNode, updateAttributes }: NodeViewProps = $props();

	const minWidth = 150;

	let vidRef: HTMLVideoElement;
	let nodeRef: HTMLDivElement;

	let resizing = $state(false);
	let resizingInitialWidth = $state(0);
	let resizingInitialMouseX = $state(0);
	let resizingPosition = $state<'left' | 'right'>('left');
	let openedMore = $state(false);

	function handleResizingPosition(e: MouseEvent, position: 'left' | 'right') {
		startResize(e);
		resizingPosition = position;
	}

	function startResize(e: MouseEvent) {
		e.preventDefault();
		resizing = true;
		resizingInitialMouseX = e.clientX;
		if (vidRef) resizingInitialWidth = vidRef.offsetWidth;
	}

	function resize(e: MouseEvent) {
		if (!resizing) return;
		let dx = e.clientX - resizingInitialMouseX;
		if (resizingPosition === 'left') {
			dx = resizingInitialMouseX - e.clientX;
		}
		const newWidth = Math.max(resizingInitialWidth + dx, minWidth);
		const parentWidth = nodeRef?.parentElement?.offsetWidth || 0;
		if (newWidth < parentWidth) {
			updateAttributes({ width: newWidth });
		}
	}

	function endResize() {
		resizing = false;
		resizingInitialMouseX = 0;
		resizingInitialWidth = 0;
	}

	function handleTouchStart(e: TouchEvent, position: 'left' | 'right') {
		e.preventDefault();
		resizing = true;
		resizingPosition = position;
		resizingInitialMouseX = e.touches[0].clientX;
		if (vidRef) resizingInitialWidth = vidRef.offsetWidth;
	}

	function handleTouchMove(e: TouchEvent) {
		if (!resizing) return;
		let dx = e.touches[0].clientX - resizingInitialMouseX;
		if (resizingPosition === 'left') {
			dx = resizingInitialMouseX - e.touches[0].clientX;
		}
		const newWidth = Math.max(resizingInitialWidth + dx, minWidth);
		const parentWidth = nodeRef?.parentElement?.offsetWidth || 0;
		if (newWidth < parentWidth) {
			updateAttributes({ width: newWidth });
		}
	}

	function handleTouchEnd() {
		resizing = false;
		resizingInitialMouseX = 0;
		resizingInitialWidth = 0;
	}

	onMount(() => {
		// Attach id to nodeRef
		nodeRef = document.getElementById('resizable-container') as HTMLDivElement;

		// Mouse events
		window.addEventListener('mousemove', resize);
		window.addEventListener('mouseup', endResize);
		// Touch events
		window.addEventListener('touchmove', handleTouchMove);
		window.addEventListener('touchend', handleTouchEnd);
	});

	onDestroy(() => {
		window.removeEventListener('mousemove', resize);
		window.removeEventListener('mouseup', endResize);
		window.removeEventListener('touchmove', handleTouchMove);
		window.removeEventListener('touchend', handleTouchEnd);
	});
</script>

<NodeViewWrapper
	id="resizable-container"
	class={cn(
		'relative flex flex-col rounded-md border-2 border-transparent',
		selected ? 'border-muted-foreground' : '',
		node.attrs.align === 'left' && 'left-0 -translate-x-0',
		node.attrs.align === 'center' && 'left-1/2 -translate-x-1/2',
		node.attrs.align === 'right' && 'left-full -translate-x-full'
	)}
	style={`width: ${node.attrs.width}px`}
	contenteditable="false"
>
	<div
		contenteditable="false"
		class={cn('group relative flex flex-col rounded-md', resizing && '')}
	>
		<video
			bind:this={vidRef}
			src={node.attrs.src}
			controls
			autoplay
			title={node.attrs.title}
			class="m-0 object-cover"
		>
			<track kind="captions" />
		</video>
		{#if node.attrs.title !== null && node.attrs.title.trim() !== ''}
			<input
				value={node.attrs.title}
				type="text"
				class="my-1 w-full bg-transparent text-center text-sm text-muted-foreground outline-none"
				onchange={(e) => {
					if (e.target === null) return;
					//@ts-ignore
					updateAttributes({ title: e.target.value });
				}}
			/>
		{/if}

		{#if editor?.isEditable}
			<div
				role="button"
				tabindex="0"
				aria-label="Back"
				class="absolute inset-y-0 z-20 flex w-[25px] cursor-col-resize items-center justify-start p-2"
				style="left: 0px"
				onmousedown={(event: MouseEvent) => {
					handleResizingPosition(event, 'left');
				}}
				ontouchstart={(event: TouchEvent) => {
					handleTouchStart(event, 'left');
				}}
			>
				<div
					class="z-20 h-[70px] w-1 rounded-xl border bg-muted opacity-0 transition-all group-hover:opacity-100"
				></div>
			</div>

			<div
				role="button"
				tabindex="0"
				aria-label="Back"
				class="absolute inset-y-0 z-20 flex w-[25px] cursor-col-resize items-center justify-end p-2"
				style="right: 0px"
				onmousedown={(event: MouseEvent) => {
					handleResizingPosition(event, 'right');
				}}
				ontouchstart={(event: TouchEvent) => {
					handleTouchStart(event, 'right');
				}}
			>
				<div
					class="z-20 h-[70px] w-1 rounded-xl border bg-muted opacity-0 transition-all group-hover:opacity-100"
				></div>
			</div>
			<div
				class={cn(
					'absolute right-4 top-2 flex items-center gap-1 rounded border bg-background p-1 opacity-0 transition-opacity',
					!resizing && 'group-hover:opacity-100',
					openedMore && 'opacity-100'
				)}
			>
				<Button
					variant="ghost"
					class={cn('size-6 p-0', node.attrs.align === 'left' && 'bg-muted')}
					onclick={() => updateAttributes({ align: 'left' })}
				>
					<AlignLeft class="size-4" />
				</Button>
				<Button
					variant="ghost"
					class={cn('size-6 p-0', node.attrs.align === 'center' && 'bg-muted')}
					onclick={() => updateAttributes({ align: 'center' })}
				>
					<AlignCenter class="size-4" />
				</Button>
				<Button
					variant="ghost"
					class={cn('size-6 p-0', node.attrs.align === 'right' && 'bg-muted')}
					onclick={() => updateAttributes({ align: 'right' })}
				>
					<AlignRight class="size-4" />
				</Button>
				<DropdownMenu.Root bind:open={openedMore} onOpenChange={(value) => (openedMore = value)}>
					<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost', class: 'size-6 p-0' })}>
						<EllipsisVertical class="size-4" />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="start" alignOffset={-90} class="mt-1 overflow-auto text-sm">
						<DropdownMenu.Item
							onclick={() => {
								if (node.attrs.title === null || node.attrs.title.trim() === '')
									updateAttributes({
										title: 'Video Caption'
									});
							}}
						>
							<Captions class="mr-1 size-4" /> Caption
						</DropdownMenu.Item>
						<DropdownMenu.Item
							onclick={() => {
								duplicateContent(editor);
							}}
						>
							<CopyIcon class="mr-1 size-4" /> Duplicate
						</DropdownMenu.Item>
						<DropdownMenu.Item
							onclick={() => {
								updateAttributes({
									width: 'fit-content'
								});
							}}
						>
							<Fullscreen class="mr-1 size-4" /> Full Screen
						</DropdownMenu.Item>
						<DropdownMenu.Item
							onclick={() => {
								deleteNode();
							}}
							class="text-destructive"
						>
							<Trash class="mr-1 size-4" /> Delete
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		{/if}
	</div>
</NodeViewWrapper>
