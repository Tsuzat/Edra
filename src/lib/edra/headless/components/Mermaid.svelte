<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import type { NodeViewProps } from '@tiptap/core';
	import mermaid from 'mermaid';
	import { Tabs, TabsList, TabsTrigger } from '../primitives/tabs/index.ts';
	import { cn } from '$lib/utils.js';
	import Workflow from '@lucide/svelte/icons/workflow';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Eye from '@lucide/svelte/icons/eye';
	import Code from '@lucide/svelte/icons/code';
	import Columns2 from '@lucide/svelte/icons/columns-2';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
	import { NodeViewWrapper } from '$lib/edra/tiptap/index.js';
	import Tooltip from './Tooltip.svelte';
	import { Download } from '@lucide/svelte';

	const { node, editor, getPos }: NodeViewProps = $props();

	// The committed code from the document
	const code = $derived(node.textContent);

	// Local editing state
	let editCode = $state('');
	let isEditing = $state(false);
	let mode = $state<'both' | 'code' | 'preview'>('both');
	let copied = $state(false);

	// Render state
	let container: HTMLDivElement | null = $state(null);
	let previewContainer: HTMLDivElement | null = $state(null);
	let error: string | null = $state(null);
	let isRendering = $state(false);

	// Debounce
	let debounceTimer: ReturnType<typeof setTimeout> | undefined;
	let renderCounter = 0;

	async function renderMermaid(target: HTMLDivElement | null, source: string) {
		if (!target || !source.trim()) {
			if (target) target.innerHTML = '';
			error = null;
			return;
		}

		const thisRender = ++renderCounter;
		isRendering = true;

		const id = `mermaid-${crypto.randomUUID().slice(0, 8)}`;
		try {
			const { svg, bindFunctions } = await mermaid.render(id, source);
			// Stale check — discard if a newer render was triggered
			if (thisRender !== renderCounter) return;
			target.innerHTML = svg;
			bindFunctions?.(target);
			error = null;
		} catch (err) {
			if (thisRender !== renderCounter) return;
			error =
				(err as Error).message
					?.replace(/[\s\S]*?Syntax error in text[\s\S]*?mermaid version[\s\S]*$/m, '')
					.trim() ||
				(err as Error).message ||
				'Failed to render diagram';
			// Clean up mermaid's orphaned SVG
			document.getElementById(id)?.remove();
		} finally {
			if (thisRender === renderCounter) {
				isRendering = false;
			}
		}
	}

	function debouncedRender(target: HTMLDivElement | null, source: string, delay = 400) {
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => renderMermaid(target, source), delay);
	}

	// Render inline preview when code changes (not editing)
	$effect(() => {
		if (!isEditing && code !== undefined && container) {
			debouncedRender(container, code, 300);
		}
	});

	// Render editor preview when editCode changes
	$effect(() => {
		if (isEditing && (mode === 'both' || mode === 'preview') && previewContainer && editCode) {
			debouncedRender(previewContainer, editCode, 500);
		}
	});

	onMount(() => {
		if (container && code) {
			renderMermaid(container, code);
		}
	});

	onDestroy(() => {
		if (debounceTimer) clearTimeout(debounceTimer);
	});

	function enterEditMode() {
		if (!editor.isEditable) return;
		editCode = code;
		isEditing = true;
		error = null;
	}

	function handleSave() {
		const trimmed = editCode.trim();
		if (!trimmed) {
			// Delete the node if empty
			editor
				.chain()
				.focus()
				.deleteRange({
					from: getPos() ?? 0,
					to: (getPos() ?? 0) + node.nodeSize
				})
				.run();
		} else {
			editor
				.chain()
				.focus()
				.insertContentAt(
					{ from: getPos() ?? 0, to: (getPos() ?? 0) + node.nodeSize },
					{
						type: 'mermaid',
						content: [{ type: 'text', text: trimmed }]
					}
				)
				.run();
		}
		isEditing = false;
	}

	function handleCancel() {
		isEditing = false;
		error = null;
	}

	function handleEditorKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			handleCancel();
		}
		if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
			e.preventDefault();
			handleSave();
		}
		// Prevent tiptap from handling Tab
		if (e.key === 'Tab') {
			e.preventDefault();
			const target = e.target as HTMLTextAreaElement;
			const start = target.selectionStart;
			const end = target.selectionEnd;
			editCode = editCode.substring(0, start) + '  ' + editCode.substring(end);
			tick().then(() => {
				target.selectionStart = target.selectionEnd = start + 2;
			});
		}
	}

	async function copyCode() {
		const source = isEditing ? editCode : code;
		if (!source) return;
		await navigator.clipboard.writeText(source);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	function downloadImage() {
		const svgEl = container?.querySelector('svg');
		if (!svgEl) return;

		const svgString = new XMLSerializer().serializeToString(svgEl);
		const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
		const DOMURL = window.URL || window.webkitURL || window;
		const url = DOMURL.createObjectURL(svgBlob);

		const rect = svgEl.getBoundingClientRect();
		const viewBoxWidth = svgEl.viewBox?.baseVal?.width;
		const viewBoxHeight = svgEl.viewBox?.baseVal?.height;

		const width = viewBoxWidth && viewBoxWidth > 0 ? viewBoxWidth : rect.width || 800;
		const height = viewBoxHeight && viewBoxHeight > 0 ? viewBoxHeight : rect.height || 600;

		const dpr = window.devicePixelRatio || 1;
		const image = new Image();

		image.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = width * dpr;
			canvas.height = height * dpr;
			const context = canvas.getContext('2d');
			if (!context) return;

			context.scale(dpr, dpr);
			context.fillRect(0, 0, width, height);
			context.drawImage(image, 0, 0, width, height);

			const pngUrl = canvas.toDataURL('image/png');
			const downloadLink = document.createElement('a');
			downloadLink.href = pngUrl;
			downloadLink.download = 'mermaid-diagram.png';
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);
			DOMURL.revokeObjectURL(url);
		};

		image.src = url;
	}

	const lineCount = $derived((isEditing ? editCode : code)?.split('\n').length ?? 0);
</script>

<NodeViewWrapper class="mermaid-wrapper" contenteditable={false}>
	{#if isEditing}
		<!-- Editing Mode -->
		<div class="edit-container">
			<!-- Toolbar -->
			<div class="toolbar-header">
				<div class="header-left">
					<Workflow class="workflow-icon text-ink" />
					<span class="header-title">Mermaid</span>
					<span class="lines-count">{lineCount} lines</span>
				</div>
				<div class="header-right">
					<Tabs value={mode} onValueChange={(val: any) => (mode = val)}>
						<TabsList>
							<TabsTrigger value="code" class="tab-btn">
								<Code class="tab-icon" />
							</TabsTrigger>
							<TabsTrigger value="both" class="tab-btn">
								<Columns2 class="tab-icon" />
							</TabsTrigger>
							<TabsTrigger value="preview" class="tab-btn">
								<Eye class="tab-icon" />
							</TabsTrigger>
						</TabsList>
					</Tabs>
					<button
						class="edra-btn edra-btn-ghost edra-btn-icon-xs"
						onclick={copyCode}
						title="Copy code"
					>
						{#if copied}
							<Check class="success-icon text-icon" />
						{:else}
							<Copy class="text-icon" />
						{/if}
					</button>

					<div class="divider"></div>

					<button class="edra-btn edra-btn-ghost btn-small" onclick={handleCancel}>Cancel</button>
					<button class="edra-btn edra-btn-primary btn-small" onclick={handleSave}>Apply</button>
				</div>
			</div>

			<!-- Editor Content -->
			<div class="editor-panels">
				{#if mode === 'both' || mode === 'code'}
					<div class="editor-panel-left {mode === 'both' ? 'border-right-only' : ''}">
						<textarea
							bind:value={editCode}
							onkeydown={handleEditorKeydown}
							placeholder="graph TD&#10;  A[Start] --> B[End]"
							spellcheck={false}
							class="mermaid-code-editor"></textarea>
						<!-- Keyboard hints -->
						<div class="keyboard-hints">
							<span>⌘↵ Apply</span>
							<span>Esc Cancel</span>
						</div>
					</div>
				{/if}
				{#if mode === 'both' || mode === 'preview'}
					<div class="editor-panel-right">
						{#if error}
							<div class="error-box">
								<div class="error-icon-wrapper">
									<TriangleAlert class="error-icon alert-icon-size" />
								</div>
								<p class="error-text">Syntax Error</p>
								<p class="error-details">
									{error}
								</p>
							</div>
						{:else if isRendering}
							<div class="loading-box">
								<div class="loading-spinner"></div>
								<span class="loading-text">Rendering...</span>
							</div>
						{/if}
						<div
							bind:this={previewContainer}
							class="mermaid-preview {error ? 'hidden-element' : ''}"
						></div>
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<!-- Preview Mode -->
		<div class="preview-box">
			{#if !code || code.trim() === ''}
				<button class="placeholder-button" onclick={enterEditMode}>
					<Workflow class="workflow-icon text-mute" />
					<span class="placeholder-text" contenteditable={false}
						>Click to add a Mermaid diagram</span
					>
				</button>
			{:else}
				<div class="rendered-card">
					<div bind:this={container} class="mermaid-container"></div>
					{#if error}
						<div class="rendered-error-footer">
							<TriangleAlert class="error-icon alert-icon-size" />
							<p class="rendered-error-text">{error}</p>
						</div>
					{/if}
				</div>
				<!-- Hover actions -->
				{#if editor.isEditable}
					<div class="hover-actions">
						<Tooltip tooltip="Download Image">
							<button
								class="edra-btn edra-btn-ghost edra-btn-icon-xs"
								onclick={downloadImage}
								title="Download Image"
							>
								<Download class="text-icon" />
							</button>
						</Tooltip>
						<Tooltip tooltip="Copy Code">
							<button
								class="edra-btn edra-btn-ghost edra-btn-icon-xs"
								onclick={copyCode}
								title="Copy code"
							>
								{#if copied}
									<Check class="success-icon text-icon" />
								{:else}
									<Copy class="text-icon" />
								{/if}
							</button>
						</Tooltip>
						<Tooltip tooltip="Edit Mode">
							<button
								class="edra-btn edra-btn-ghost edra-btn-icon-xs"
								onclick={enterEditMode}
								title="Edit diagram"
							>
								<Pencil class="text-icon" />
							</button>
						</Tooltip>
					</div>
				{/if}
			{/if}
		</div>
	{/if}
</NodeViewWrapper>

<style>
	:global(.mermaid-wrapper) {
		margin-top: 1rem;
		margin-bottom: 1rem;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}
	.edit-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		border: 1px solid var(--edra-border);
		border-radius: var(--edra-radius-lg);
		overflow: hidden;
		background-color: var(--edra-canvas);
		height: 28rem;
	}
	.toolbar-header {
		border-bottom: 1px solid var(--edra-border);
		background-color: var(--edra-canvas-soft);
		padding: 0.375rem 0.75rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.header-left,
	.header-right {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	:global(.text-ink) {
		color: var(--edra-ink);
	}
	.header-title {
		font-size: 11px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--edra-mute);
	}
	.lines-count {
		color: var(--edra-mute);
		font-size: 10px;
	}
	.divider {
		background-color: var(--edra-border);
		margin-left: 0.25rem;
		margin-right: 0.25rem;
		height: 1rem;
		width: 1px;
	}
	.btn-small {
		height: 1.75rem;
		padding-left: 0.625rem;
		padding-right: 0.625rem;
		font-size: 0.75rem;
	}
	.editor-panels {
		display: flex;
		flex: 1;
		min-height: 0;
		overflow: hidden;
	}
	.editor-panel-left {
		flex: 1;
		min-height: 0;
		position: relative;
	}
	.editor-panel-left.border-right-only {
		border-right: 1px solid var(--edra-border);
	}
	.mermaid-code-editor {
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 1rem;
		font-family: var(--edra-font-mono);
		resize: none;
		border: none;
		background-color: var(--edra-canvas-soft);
		font-size: 13px;
		line-height: 1.625;
		color: var(--edra-ink);
		outline: none;
	}
	.mermaid-code-editor::placeholder {
		color: var(--edra-mute);
	}
	.keyboard-hints {
		position: absolute;
		display: flex;
		gap: 0.5rem;
		font-size: 9px;
		bottom: 0.5rem;
		right: 0.5rem;
		color: var(--edra-mute);
	}
	.editor-panel-right {
		flex: 1;
		min-height: 0;
		overflow: auto;
		background-color: var(--edra-canvas);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		position: relative;
	}
	.error-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		text-align: center;
		max-width: 20rem;
	}
	.error-icon-wrapper {
		background-color: var(--edra-error-soft);
		display: flex;
		width: 2rem;
		height: 2rem;
		align-items: center;
		justify-content: center;
		border-radius: var(--edra-radius-md);
	}
	:global(.error-icon) {
		color: var(--edra-error);
	}
	.error-text {
		color: var(--edra-error);
		font-size: 0.75rem;
		font-weight: 500;
	}
	.error-details {
		color: var(--edra-mute);
		font-family: var(--edra-font-mono);
		font-size: 10px;
		line-height: 1.625;
		max-height: 6rem;
		overflow: auto;
	}
	.loading-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}
	.loading-spinner {
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 50%;
		border: 2px solid var(--edra-border);
		border-top-color: var(--edra-ink);
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.loading-text {
		color: var(--edra-mute);
		font-size: 10px;
	}
	.mermaid-preview {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.mermaid-preview :global(svg) {
		max-width: 100%;
		height: auto;
	}
	.preview-box {
		position: relative;
		width: 100%;
	}
	.placeholder-button {
		display: flex;
		width: 100%;
		align-items: center;
		gap: 0.5rem;
		border-radius: var(--edra-radius-lg);
		border: 1px dashed var(--edra-border);
		background-color: var(--edra-canvas-soft);
		padding: 1rem;
		transition: background-color 150ms ease;
		min-height: 3.5rem;
		cursor: pointer;
	}
	.placeholder-button:hover {
		background-color: var(--edra-canvas-soft-2);
	}
	:global(.text-mute) {
		color: var(--edra-mute);
	}
	.placeholder-text {
		color: var(--edra-mute);
		font-size: 0.875rem;
	}
	.rendered-card {
		border: 1px solid var(--edra-border);
		border-radius: var(--edra-radius-lg);
		overflow: hidden;
		background-color: var(--edra-canvas);
	}
	.mermaid-container {
		width: 100%;
		overflow-x: auto;
		padding: 1.5rem;
		display: flex;
		justify-content: center;
		min-height: 6rem;
		align-items: center;
	}
	.mermaid-container :global(svg) {
		max-width: 100%;
		height: auto;
		margin-left: auto;
		margin-right: auto;
	}
	.rendered-error-footer {
		border-top: 1px solid var(--edra-border);
		background-color: var(--edra-error-soft);
		padding: 0.5rem 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.rendered-error-text {
		color: var(--edra-error);
		font-size: 0.75rem;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.hover-actions {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		display: flex;
		align-items: center;
		gap: 0.25rem;
		opacity: 0;
		transition: opacity 150ms ease;
	}
	.preview-box:hover .hover-actions {
		opacity: 1;
	}
	:global(.success-icon) {
		color: var(--edra-success) !important;
	}
	:global(.workflow-icon) {
		width: 1rem;
		height: 1rem;
		color: var(--edra-mute);
	}
	:global(.tab-btn) {
		padding: 0.25rem 0.5rem !important;
	}
	:global(.tab-icon) {
		width: 0.875rem;
		height: 0.875rem;
		color: var(--edra-mute);
	}
	:global(.text-icon) {
		width: 0.875rem;
		height: 0.875rem;
		color: var(--edra-mute);
	}
	:global(.alert-icon-size) {
		width: 1rem;
		height: 1rem;
	}
	.hidden-element {
		display: none !important;
	}
</style>
