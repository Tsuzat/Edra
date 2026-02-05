<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { cn } from '$lib/utils.js';
	import AlignCenter from '@lucide/svelte/icons/text-align-center';
	import AlignLeft from '@lucide/svelte/icons/text-align-start';
	import AlignRight from '@lucide/svelte/icons/text-align-end';
	import Captions from '@lucide/svelte/icons/captions';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import EllipsisVertical from '@lucide/svelte/icons/ellipsis-vertical';
	import Fullscreen from '@lucide/svelte/icons/fullscreen';
	import Trash from '@lucide/svelte/icons/trash';
	import type { NodeViewProps } from '@tiptap/core';
	import { onDestroy, onMount, type Snippet } from 'svelte';
	import { NodeViewWrapper } from 'svelte-tiptap';
	import { duplicateContent } from '../../utils.js';
	import strings from '../../strings.js';

	interface MediaExtendedProps extends NodeViewProps {
		children: Snippet<[]>;
		mediaRef?: HTMLElement;
	}

	const {
		node,
		editor,
		selected,
		deleteNode,
		updateAttributes,
		children,
		mediaRef = $bindable()
	}: MediaExtendedProps = $props();

	const minWidthPercent = 20;
	const maxWidthPercent = 100;

	let nodeRef = $state<HTMLElement>();

	let resizing = $state(false);
	let resizingInitialWidthPercent = $state(0);
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
		if (mediaRef && nodeRef?.parentElement) {
			const currentWidth = mediaRef.offsetWidth;
			const parentWidth = nodeRef.parentElement.offsetWidth;
			resizingInitialWidthPercent = (currentWidth / parentWidth) * 100;
		}
	}

	function resize(e: MouseEvent) {
		if (!resizing || !nodeRef?.parentElement) return;
		let dx = e.clientX - resizingInitialMouseX;
		if (resizingPosition === 'left') {
			dx = resizingInitialMouseX - e.clientX;
		}
		const parentWidth = nodeRef.parentElement.offsetWidth;
		const deltaPercent = (dx / parentWidth) * 100;
		const newWidthPercent = Math.max(
			Math.min(resizingInitialWidthPercent + deltaPercent, maxWidthPercent),
			minWidthPercent
		);
		updateAttributes({ width: `${newWidthPercent}%` });
	}

	function endResize() {
		resizing = false;
		resizingInitialMouseX = 0;
		resizingInitialWidthPercent = 0;
	}

	function handleTouchStart(e: TouchEvent, position: 'left' | 'right') {
		e.preventDefault();
		resizing = true;
		resizingPosition = position;
		resizingInitialMouseX = e.touches[0].clientX;
		if (mediaRef && nodeRef?.parentElement) {
			const currentWidth = mediaRef.offsetWidth;
			const parentWidth = nodeRef.parentElement.offsetWidth;
			resizingInitialWidthPercent = (currentWidth / parentWidth) * 100;
		}
	}

	function handleTouchMove(e: TouchEvent) {
		if (!resizing || !nodeRef?.parentElement) return;
		let dx = e.touches[0].clientX - resizingInitialMouseX;
		if (resizingPosition === 'left') {
			dx = resizingInitialMouseX - e.touches[0].clientX;
		}
		const parentWidth = nodeRef.parentElement.offsetWidth;
		const deltaPercent = (dx / parentWidth) * 100;
		const newWidthPercent = Math.max(
			Math.min(resizingInitialWidthPercent + deltaPercent, maxWidthPercent),
			minWidthPercent
		);
		updateAttributes({ width: `${newWidthPercent}%` });
	}

	function handleTouchEnd() {
		resizing = false;
		resizingInitialMouseX = 0;
		resizingInitialWidthPercent = 0;
	}

	onMount(() => {
		// Attach id to nodeRef
		nodeRef = document.getElementById('resizable-container-media') as HTMLDivElement;

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
	id="resizable-container-media"
	class={cn(
		'relative my-4! flex flex-col rounded-md border border-transparent',
		selected && 'ring-1',
		node.attrs.align === 'left' && 'left-0 translate-x-0',
		node.attrs.align === 'center' && 'left-1/2 -translate-x-1/2',
		node.attrs.align === 'right' && 'left-full -translate-x-full'
	)}
	style={`width: ${node.attrs.width}`}
>
	<div class={cn('group relative flex flex-col rounded-md', resizing && '')}>
		{@render children()}
		{#if node.attrs.title !== null && node.attrs.title.trim() !== ''}
			<input
				value={node.attrs.title}
				type="text"
				class="text-muted-foreground my-1 w-full bg-transparent text-center text-sm outline-none"
				onchange={(e) => {
					const target = e.target as HTMLInputElement;
					updateAttributes({ title: target.value });
				}}
			/>
		{/if}
		{#if editor.isEditable}
			<div
				role="button"
				tabindex="0"
				aria-label={strings.extension.media.back}
				class="absolute inset-y-0 z-20 flex w-5 cursor-col-resize items-center justify-start p-2"
				style="left: 0px"
				onmousedown={(event: MouseEvent) => {
					handleResizingPosition(event, 'left');
				}}
				ontouchstart={(event: TouchEvent) => {
					handleTouchStart(event, 'left');
				}}
			>
				<div
					class="bg-muted z-20 h-16 w-1 rounded-xl border opacity-0 transition-all group-hover:opacity-100"
				></div>
			</div>

			<div
				role="button"
				tabindex="0"
				aria-label={strings.extension.media.back}
				class="absolute inset-y-0 z-20 flex w-5 cursor-col-resize items-center justify-end p-2"
				style="right: 0px"
				onmousedown={(event: MouseEvent) => {
					handleResizingPosition(event, 'right');
				}}
				ontouchstart={(event: TouchEvent) => {
					handleTouchStart(event, 'right');
				}}
			>
				<div
					class="bg-muted z-20 h-16 w-1 rounded-xl border opacity-0 transition-all group-hover:opacity-100"
				></div>
			</div>
			<div
				class={cn(
					'bg-background/50 absolute -top-2 left-[calc(50%-3rem)] flex items-center gap-1 rounded border p-1 opacity-0 backdrop-blur-sm transition-opacity',
					!resizing && 'group-hover:opacity-100',
					openedMore && 'opacity-100'
				)}
			>
				<Button
					variant="ghost"
					class={cn('size-6 p-0', node.attrs.align === 'left' && 'bg-muted')}
					onclick={() => updateAttributes({ align: 'left' })}
					title={strings.extension.media.alignLeft}
				>
					<AlignLeft class="size-4" />
				</Button>
				<Button
					variant="ghost"
					class={cn('size-6 p-0', node.attrs.align === 'center' && 'bg-muted')}
					onclick={() => updateAttributes({ align: 'center' })}
					title={strings.extension.media.alignCenter}
				>
					<AlignCenter class="size-4" />
				</Button>
				<Button
					variant="ghost"
					class={cn('size-6 p-0', node.attrs.align === 'right' && 'bg-muted')}
					onclick={() => updateAttributes({ align: 'right' })}
					title={strings.extension.media.alignRight}
				>
					<AlignRight class="size-4" />
				</Button>
				<DropdownMenu.Root
					bind:open={openedMore}
					onOpenChange={(value: boolean) => (openedMore = value)}
				>
					<DropdownMenu.Trigger
						class={buttonVariants({ variant: 'ghost', class: 'size-6 p-0' })}
						title={strings.extension.media.moreOptions}
					>
						<EllipsisVertical class="size-4" />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="start" alignOffset={-90} class="mt-1 overflow-auto text-sm">
						<DropdownMenu.Item
							onclick={() => {
								if (node.attrs.title === null || node.attrs.title.trim() === '')
									updateAttributes({
										title: strings.extension.media.captionPlaceholder
									});
							}}
						>
							<Captions class="mr-1 size-4" />
							{strings.extension.media.caption}
						</DropdownMenu.Item>
						<DropdownMenu.Item
							onclick={() => {
								duplicateContent(editor, node);
							}}
						>
							<CopyIcon class="mr-1 size-4" />
							{strings.extension.media.duplicate}
						</DropdownMenu.Item>
						<DropdownMenu.Item
							onclick={() => {
								updateAttributes({
									width: '100%'
								});
							}}
						>
							<Fullscreen class="mr-1 size-4" />
							{strings.extension.media.fullscreen}
						</DropdownMenu.Item>
						<DropdownMenu.Item
							onclick={() => {
								deleteNode();
							}}
							class="text-destructive"
						>
							<Trash class="mr-1 size-4" />
							{strings.extension.media.delete}
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		{/if}
	</div>
</NodeViewWrapper>
