<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { NodeViewWrapper } from 'svelte-tiptap';
	import type { NodeViewProps } from '@tiptap/core';

	import AlignLeft from 'lucide-svelte/icons/align-left';
	import AlignCenter from 'lucide-svelte/icons/align-center';
	import AlignRight from 'lucide-svelte/icons/align-right';
	import CopyIcon from 'lucide-svelte/icons/copy';
	import Fullscreen from 'lucide-svelte/icons/fullscreen';
	import Trash from 'lucide-svelte/icons/trash';
	import Captions from 'lucide-svelte/icons/captions';

	import { duplicateContent } from '../../utils.js';

	const { node, editor, selected, deleteNode, updateAttributes }: NodeViewProps = $props();

	const minWidth = 150;

	let vidRef: HTMLVideoElement;
	let nodeRef: HTMLDivElement;

	let caption: string | null = $state(node.attrs.title);
	$effect(() => {
		if (caption?.trim() === '') caption = null;
		updateAttributes({ title: caption });
	});

	let resizing = $state(false);
	let resizingInitialWidth = $state(0);
	let resizingInitialMouseX = $state(0);
	let resizingPosition = $state<'left' | 'right'>('left');

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
	class={`edra-media-container ${selected ? 'selected' : ''} align-${node.attrs.align}`}
	style={`width: ${node.attrs.width}px`}
>
	<div class={`edra-media-group ${resizing ? 'resizing' : ''}`}>
		<video
			bind:this={vidRef}
			src={node.attrs.src}
			controls
			title={node.attrs.title}
			class="edra-media-content"
		>
			<track kind="captions" />
		</video>

		{#if caption !== null}
			<input bind:value={caption} type="text" class="edra-media-caption" />
		{/if}

		{#if editor?.isEditable}
			<div
				role="button"
				tabindex="0"
				aria-label="Resize left"
				class="edra-media-resize-handle edra-media-resize-handle-left"
				onmousedown={(event: MouseEvent) => {
					handleResizingPosition(event, 'left');
				}}
				ontouchstart={(event: TouchEvent) => {
					handleTouchStart(event, 'left');
				}}
			>
				<div class="edra-media-resize-indicator"></div>
			</div>

			<div
				role="button"
				tabindex="0"
				aria-label="Resize right"
				class="edra-media-resize-handle edra-media-resize-handle-right"
				onmousedown={(event: MouseEvent) => {
					handleResizingPosition(event, 'right');
				}}
				ontouchstart={(event: TouchEvent) => {
					handleTouchStart(event, 'right');
				}}
			>
				<div class="edra-media-resize-indicator"></div>
			</div>

			<div class="edra-media-toolbar">
				<button
					class={`edra-toolbar-button ${node.attrs.align === 'left' ? 'active' : ''}`}
					onclick={() => updateAttributes({ align: 'left' })}
					title="Align Left"
				>
					<AlignLeft />
				</button>
				<button
					class={`edra-toolbar-button ${node.attrs.align === 'center' ? 'active' : ''}`}
					onclick={() => updateAttributes({ align: 'center' })}
					title="Align Center"
				>
					<AlignCenter />
				</button>
				<button
					class={`edra-toolbar-button ${node.attrs.align === 'right' ? 'active' : ''}`}
					onclick={() => updateAttributes({ align: 'right' })}
					title="Align Right"
				>
					<AlignRight />
				</button>
				<button
					class="edra-toolbar-button"
					onclick={() => {
						if (caption === null || caption.trim() === '') caption = 'Video Caption';
					}}
					title="Caption"
				>
					<Captions />
				</button>
				<button
					class="edra-toolbar-button"
					onclick={() => {
						duplicateContent(editor, node);
					}}
					title="Duplicate"
				>
					<CopyIcon />
				</button>
				<button
					class="edra-toolbar-button"
					onclick={() => {
						updateAttributes({
							width: 'fit-content'
						});
					}}
					title="Full Screen"
				>
					<Fullscreen />
				</button>
				<button
					class="edra-toolbar-button edra-destructive"
					onclick={() => {
						deleteNode();
					}}
					title="Delete"
				>
					<Trash />
				</button>
			</div>
		{/if}
	</div>
</NodeViewWrapper>
