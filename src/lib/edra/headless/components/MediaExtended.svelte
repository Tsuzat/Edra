<script lang="ts">
	import { Root, Trigger, Content, Item } from '../primitives/dropdown/index.ts';
	import { cn } from '$lib/utils.js';
	import AlignCenter from '@lucide/svelte/icons/text-align-center';
	import AlignLeft from '@lucide/svelte/icons/text-align-start';
	import AlignRight from '@lucide/svelte/icons/text-align-end';
	import Captions from '@lucide/svelte/icons/captions';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import EllipsisVertical from '@lucide/svelte/icons/ellipsis-vertical';
	import Fullscreen from '@lucide/svelte/icons/fullscreen';
	import Trash from '@lucide/svelte/icons/trash-2';
	import type { NodeViewProps } from '@tiptap/core';
	import { onDestroy, onMount, type Snippet } from 'svelte';
	import { duplicateContent } from '../../utils.js';
	import strings from '../../strings.js';
	import { NodeViewWrapper } from '$lib/edra/tiptap/index.js';

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
		'media-extended-wrapper',
		selected && 'selected',
		node.attrs.align === 'left' && 'align-left',
		node.attrs.align === 'center' && 'align-center',
		node.attrs.align === 'right' && 'align-right'
	)}
	style={`width: ${node.attrs.width}`}
>
	<div class="media-group">
		{@render children()}
		{#if node.attrs.title !== null && node.attrs.title.trim() !== ''}
			<input
				value={node.attrs.title}
				type="text"
				class="media-title-input"
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
				class="resize-handle resize-handle-left"
				onmousedown={(event: MouseEvent) => {
					handleResizingPosition(event, 'left');
				}}
				ontouchstart={(event: TouchEvent) => {
					handleTouchStart(event, 'left');
				}}
			>
				<div class="resize-bar"></div>
			</div>

			<div
				role="button"
				tabindex="0"
				aria-label={strings.extension.media.back}
				class="resize-handle resize-handle-right"
				onmousedown={(event: MouseEvent) => {
					handleResizingPosition(event, 'right');
				}}
				ontouchstart={(event: TouchEvent) => {
					handleTouchStart(event, 'right');
				}}
			>
				<div class="resize-bar"></div>
			</div>
			<div
				class={cn(
					'media-toolbar',
					openedMore && 'opened'
				)}
			>
				<button
					class="edra-btn edra-btn-ghost edra-btn-icon-xs {node.attrs.align === 'left'
						? 'media-align-active'
						: ''}"
					onclick={() => updateAttributes({ align: 'left' })}
					title={strings.extension.media.alignLeft}
				>
					<AlignLeft class="media-icon" />
				</button>
				<button
					class="edra-btn edra-btn-ghost edra-btn-icon-xs {node.attrs.align === 'center'
						? 'media-align-active'
						: ''}"
					onclick={() => updateAttributes({ align: 'center' })}
					title={strings.extension.media.alignCenter}
				>
					<AlignCenter class="media-icon" />
				</button>
				<button
					class="edra-btn edra-btn-ghost edra-btn-icon-xs {node.attrs.align === 'right'
						? 'media-align-active'
						: ''}"
					onclick={() => updateAttributes({ align: 'right' })}
					title={strings.extension.media.alignRight}
				>
					<AlignRight class="media-icon" />
				</button>

				<Root bind:open={openedMore}>
					<Trigger
						class="edra-btn edra-btn-ghost edra-btn-icon-xs"
						title={strings.extension.media.moreOptions}
					>
						<EllipsisVertical class="media-icon" />
					</Trigger>
					<Content align="start" class="more-options-menu">
						<Item
							onclick={() => {
								if (node.attrs.title === null || node.attrs.title.trim() === '')
									updateAttributes({
										title: strings.extension.media.captionPlaceholder
									});
							}}
						>
							<Captions class="media-icon" />
							<span>{strings.extension.media.caption}</span>
						</Item>
						<Item
							onclick={() => {
								duplicateContent(editor, node);
							}}
						>
							<CopyIcon class="media-icon" />
							<span>{strings.extension.media.duplicate}</span>
						</Item>
						<Item
							onclick={() => {
								updateAttributes({
									width: '100%'
								});
							}}
						>
							<Fullscreen class="media-icon" />
							<span>{strings.extension.media.fullscreen}</span>
						</Item>
						<Item
							onclick={() => {
								deleteNode();
							}}
							class="text-(--edra-error) hover:bg-(--edra-error-soft)"
						>
							<Trash class="media-icon" />
							<span>{strings.extension.media.delete}</span>
						</Item>
					</Content>
				</Root>
			</div>
		{/if}
	</div>
</NodeViewWrapper>

<style>
	.media-extended-wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
		border-radius: var(--edra-radius-md);
		margin-top: 1rem;
		margin-bottom: 1rem;
		border: 1px solid transparent;
	}
	.media-extended-wrapper.selected {
		box-shadow: 0 0 0 1px var(--edra-link);
	}
	.media-extended-wrapper.align-left {
		left: 0;
		transform: translateX(0);
	}
	.media-extended-wrapper.align-center {
		left: 50%;
		transform: translateX(-50%);
	}
	.media-extended-wrapper.align-right {
		left: 100%;
		transform: translateX(-100%);
	}
	.media-group {
		position: relative;
		display: flex;
		flex-direction: column;
		border-radius: var(--edra-radius-md);
	}
	.media-title-input {
		color: var(--edra-body);
		margin-top: 0.25rem;
		margin-bottom: 0.25rem;
		width: 100%;
		background-color: transparent;
		text-align: center;
		font-size: 0.875rem;
		outline: none;
		border: none;
		border-bottom: 1px solid transparent;
	}
	.media-title-input:focus {
		border-bottom-color: var(--edra-border);
	}
	.resize-handle {
		position: absolute;
		display: flex;
		top: 0;
		bottom: 0;
		z-index: 20;
		width: 1.25rem;
		cursor: col-resize;
		align-items: center;
		padding: 0.5rem;
	}
	.resize-handle-left {
		left: 0;
		justify-content: flex-start;
	}
	.resize-handle-right {
		right: 0;
		justify-content: flex-end;
	}
	.resize-bar {
		background-color: var(--edra-canvas-soft-2);
		z-index: 20;
		height: 4rem;
		width: 4px;
		border-radius: var(--edra-radius-pill);
		border: 1px solid var(--edra-border);
		opacity: 0;
		transition: opacity 150ms ease;
	}
	.media-group:hover .resize-bar {
		opacity: 1;
	}
	.media-toolbar {
		position: absolute;
		display: flex;
		align-items: center;
		gap: 4px;
		border: 1px solid var(--edra-border);
		padding: 4px;
		background-color: var(--edra-canvas);
		top: -0.5rem;
		left: calc(50% - 3.5rem);
		z-index: 20;
		border-radius: var(--edra-radius-md);
		box-shadow: var(--edra-shadow-3);
		opacity: 0;
		transition: opacity 150ms ease;
	}
	.media-group:hover .media-toolbar,
	.media-toolbar.opened {
		opacity: 1;
	}
	.media-align-active {
		background-color: var(--edra-canvas-soft-2) !important;
		color: var(--edra-ink) !important;
	}
	:global(.media-icon) {
		width: 0.875rem;
		height: 0.875rem;
	}
	:global(.more-options-menu) {
		margin-top: 4px !important;
		font-size: 0.875rem !important;
	}
</style>
