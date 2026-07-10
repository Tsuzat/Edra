<script lang="ts">
	import {
		BubbleMenu,
		getEditor,
		removeAIHighlight,
		useEditorTransaction
	} from '$lib/edra/tiptap/index.js';
	import {
		AIState,
		CONTINUE_WRITING_PROMPT,
		FIX_GRAMMAR_PROMPT,
		IMPROVE_WRITING_PROMPT,
		MAKE_LONGER_PROMPT,
		MAKE_SHORTER_PROMPT,
		SIMPLIFY_LANGUAGE_PROMPT,
		SOLVE_PROBLEM_PROMPT,
		SUMMARIZE_PROMPT
	} from '../../../commands/index.js';
	import { fade, slide } from 'svelte/transition';
	import {
		Sparkle,
		Check,
		CornerDownLeft,
		Copy,
		RotateCcw,
		Trash2,
		Brain,
		ArrowDownWideNarrow,
		CheckCheck,
		Feather,
		PenLine,
		RefreshCcwDot,
		Sparkles,
		TextWrap,
		Send
	} from '@lucide/svelte';

	let inputTag = $state<HTMLTextAreaElement | null>(null);
	const editor = getEditor();

	let inputValue = $state('');
	let aiState = $state(AIState.Idle);
	let aiResponse = $state('');
	let activeOptionIndex = $state(0);
	let generating = $state(false);
	let statusMessage = $state('');

	// Position tracking for inline editor streaming
	let originalFrom = $state(0);
	let aiContentFrom = $state(0);
	let aiContentTo = $state(0);
	let lastPrompt = $state('');
	let updateTimer: ReturnType<typeof setTimeout> | null = null;

	const activeCallAI = $derived(
		editor.extensionManager.extensions.find((e) => e.name === 'ai-highlight')?.options?.callAI
	);
	const transaction = useEditorTransaction(editor);

	function showStatus(msg: string, duration = 3000) {
		statusMessage = msg;
		setTimeout(() => {
			statusMessage = '';
		}, duration);
	}

	function isAIActive() {
		void transaction.version;
		return editor.isActive('ai-highlight');
	}

	function getAIHighlightedText(): string | undefined {
		void transaction.version;
		let range = { from: -1, to: -1 };
		editor.state.doc.descendants((node, pos) => {
			if (node.marks.some((mark) => mark.type.name === 'ai-highlight')) {
				if (range.from === -1) range.from = pos;
				range.to = pos + node.nodeSize;
			}
		});
		if (range.from === -1 || range.to === -1) return undefined;
		const slice = editor.view.state.doc.cut(range.from, range.to);
		if (editor.markdown) return editor.markdown.serialize(slice.toJSON());
		return editor.state.doc.textBetween(range.from, range.to);
	}

	async function processText(
		type:
			'shorter' | 'longer' | 'summarize' | 'grammer' | 'continue' | 'solve' | 'improve' | 'simplify'
	) {
		const selectedText = getAIHighlightedText();
		if (!selectedText || selectedText.trim().length === 0) {
			showStatus('Can not get the selected content from editor');
			return;
		}
		try {
			let prompt = '';
			switch (type) {
				case 'shorter':
					prompt = MAKE_SHORTER_PROMPT(selectedText);
					break;
				case 'longer':
					prompt = MAKE_LONGER_PROMPT(selectedText);
					break;
				case 'summarize':
					prompt = SUMMARIZE_PROMPT(selectedText);
					break;
				case 'grammer':
					prompt = FIX_GRAMMAR_PROMPT(selectedText);
					break;
				case 'continue':
					prompt = CONTINUE_WRITING_PROMPT(selectedText);
					break;
				case 'solve':
					prompt = SOLVE_PROBLEM_PROMPT(selectedText);
					break;
				case 'improve':
					prompt = IMPROVE_WRITING_PROMPT(selectedText);
					break;
				case 'simplify':
					prompt = SIMPLIFY_LANGUAGE_PROMPT(selectedText);
					break;
			}
			aiState = AIState.Confirmation;
			await generateAIContent(prompt);
		} catch (error) {
			aiState = AIState.Idle;
			console.error(error);
			showStatus('Something went wrong!');
		}
	}

	async function handleSubmit(e?: Event) {
		if (e) e.preventDefault();
		if (!inputValue || inputValue.trim().length === 0) return;
		const text = getAIHighlightedText() || '';
		try {
			const prompt = `${text}\n\n\n${inputValue}`;
			inputValue = '';
			if (inputTag) inputTag.style.height = 'auto';
			aiState = AIState.Confirmation;
			await generateAIContent(prompt);
		} catch (error) {
			aiState = AIState.Idle;
			console.error(error);
			showStatus('Something went wrong!');
		}
	}

	async function generateAIContent(prompt: string) {
		void transaction.version;
		generating = true;
		lastPrompt = prompt;
		aiResponse = '';

		// Save current selection positions
		const { from, to } = editor.state.selection;
		originalFrom = from;

		// Calculate insertion position: right after the top-level block containing the selection end
		const to_ = editor.state.doc.resolve(to);
		const depth = Math.min(to_.depth, 1) || 1;
		aiContentFrom = to_.after(depth);
		aiContentTo = aiContentFrom;

		try {
			const onChunk = (chunk: string) => {
				aiResponse += chunk;
				scheduleEditorUpdate();
			};
			const onError = (error: Error) => {
				showStatus('Something went wrong when calling AI.');
				console.error(error);
				cleanupAIContent();
				aiState = AIState.Idle;
				aiResponse = '';
				generating = false;
			};

			if (activeCallAI) {
				await activeCallAI(prompt, onChunk, onError);
			}
			// Final flush to ensure all content is rendered in the editor
			flushEditorUpdate();
		} finally {
			generating = false;
		}
	}

	/** Throttle editor updates to ~100ms to avoid excessive transactions */
	function scheduleEditorUpdate() {
		if (updateTimer) return;
		updateTimer = setTimeout(() => {
			flushEditorUpdate();
			updateTimer = null;
		}, 100);
	}

	/** Insert or replace the AI content region in the editor with the accumulated response */
	function flushEditorUpdate() {
		void transaction.version;
		if (updateTimer) {
			clearTimeout(updateTimer);
			updateTimer = null;
		}
		if (!aiResponse) return;

		try {
			const oldDocSize = editor.state.doc.content.size;

			if (aiContentFrom >= aiContentTo) {
				// First insert — no existing AI content to replace
				editor
					.chain()
					.command(({ tr }) => {
						tr.setMeta('addToHistory', false);
						return true;
					})
					.insertContentAt(aiContentFrom, aiResponse, {
						contentType: 'markdown'
					})
					.run();
			} else {
				// Replace existing AI content with the updated (longer) response
				editor
					.chain()
					.command(({ tr }) => {
						tr.setMeta('addToHistory', false);
						return true;
					})
					.insertContentAt({ from: aiContentFrom, to: aiContentTo }, aiResponse, {
						contentType: 'markdown'
					})
					.run();
			}

			const newDocSize = editor.state.doc.content.size;
			// The content AFTER the AI region is unchanged, so:
			// newAiContentTo = newDocSize - (oldDocSize - oldAiContentTo)
			aiContentTo = newDocSize - (oldDocSize - aiContentTo);

			// Highlight the AI-generated content with a distinct color
			const tr = editor.state.tr;
			tr.setMeta('addToHistory', false);
			tr.addMark(
				aiContentFrom,
				aiContentTo,
				editor.state.schema.marks['ai-highlight'].create({
					color: 'var(--edra-canvas-soft-2)'
				})
			);
			editor.view.dispatch(tr);

			// Move cursor to end of AI content so bubble menu follows it
			if (aiContentTo > 1) {
				editor.commands.setTextSelection(aiContentTo - 1);
			}
		} catch (error) {
			console.error('Error updating editor with AI content:', error);
		}
	}

	/** Remove AI-generated content from the editor (without adding to undo history) */
	function cleanupAIContent() {
		void transaction.version;
		if (aiContentFrom < aiContentTo) {
			try {
				editor
					.chain()
					.command(({ tr }) => {
						tr.setMeta('addToHistory', false);
						return true;
					})
					.deleteRange({ from: aiContentFrom, to: aiContentTo })
					.run();
				aiContentTo = aiContentFrom;
			} catch (error) {
				console.error('Error cleaning up AI content:', error);
			}
		}
	}

	/** Replace: delete original selection, keep AI text */
	function replaceSelection() {
		void transaction.version;
		try {
			const response = aiResponse;

			// Delete everything from original selection start to AI content end
			editor.chain().deleteRange({ from: originalFrom, to: aiContentTo }).run();

			// Insert the AI response at the original position
			editor
				.chain()
				.insertContentAt(originalFrom, response, {
					contentType: 'markdown'
				})
				.run();

			removeAIHighlight(editor);
			aiState = AIState.Idle;
			aiResponse = '';
		} catch (error) {
			console.error(error);
			showStatus('Unable to replace. Copy and paste manually.');
		}
	}

	/** Insert below: AI text is already below the selection — just accept */
	function insertNext() {
		removeAIHighlight(editor);
		aiState = AIState.Idle;
		aiResponse = '';
	}

	/** Copy AI response to clipboard */
	function copyToClipboard() {
		window.navigator.clipboard.writeText(aiResponse);
		showStatus('Copied to clipboard');
	}

	/** Retry: delete AI content, re-run with same prompt */
	function retry() {
		cleanupAIContent();
		aiResponse = '';
		if (lastPrompt) {
			generateAIContent(lastPrompt);
		}
	}

	/** Discard: delete AI content, keep original, reset */
	function discardChanges() {
		cleanupAIContent();
		removeAIHighlight(editor);
		aiState = AIState.Idle;
		aiResponse = '';
	}

	/** Close AI: full cleanup */
	function closeAI() {
		if (generating) {
			generating = false;
		}
		cleanupAIContent();
		removeAIHighlight(editor);
		aiState = AIState.Idle;
		aiResponse = '';
		lastPrompt = '';
	}

	const quickActions = [
		{
			id: 'improve',
			label: 'Improve writing',
			icon: Sparkles,
			handler: () => processText('improve')
		},
		{
			id: 'grammer',
			label: 'Fix spelling & grammar',
			icon: CheckCheck,
			handler: () => processText('grammer')
		},
		{
			id: 'shorter',
			label: 'Make shorter',
			icon: ArrowDownWideNarrow,
			handler: () => processText('shorter')
		},
		{
			id: 'longer',
			label: 'Make longer',
			icon: TextWrap,
			handler: () => processText('longer')
		},
		{
			id: 'simplify',
			label: 'Simplify language',
			icon: Feather,
			handler: () => processText('simplify')
		},
		{
			id: 'summarize',
			label: 'Summarize',
			icon: RefreshCcwDot,
			handler: () => processText('summarize')
		},
		{
			id: 'continue',
			label: 'Continue writing',
			icon: PenLine,
			handler: () => processText('continue')
		},
		{
			id: 'solve',
			label: 'Solve problem',
			icon: Brain,
			handler: () => processText('solve')
		}
	];

	function scrollActiveOptionIntoView() {
		setTimeout(() => {
			const activeEl = document.querySelector('.quick-action-active');
			if (activeEl) {
				activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
			}
		}, 0);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!isAIActive() && aiState !== AIState.Confirmation) return;

		if (event.key === 'Escape') {
			event.preventDefault();
			closeAI();
			return;
		}

		if (aiState === AIState.Idle) {
			const showQuickActions = isAIActive() && inputValue.trim()?.length === 0;
			if (showQuickActions) {
				if (event.key === 'ArrowDown') {
					event.preventDefault();
					activeOptionIndex = (activeOptionIndex + 1) % quickActions.length;
					scrollActiveOptionIntoView();
					return;
				}
				if (event.key === 'ArrowUp') {
					event.preventDefault();
					activeOptionIndex = (activeOptionIndex - 1 + quickActions.length) % quickActions.length;
					scrollActiveOptionIntoView();
					return;
				}
				if (event.key === 'Enter') {
					event.preventDefault();
					quickActions[activeOptionIndex].handler();
					return;
				}
			} else {
				if (event.key === 'Enter' && !event.shiftKey) {
					event.preventDefault();
					handleSubmit();
					return;
				}
			}
		}
	}

	function handleInput(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		target.style.height = `${target.scrollHeight}px`;
	}
</script>

<svelte:document onkeydown={handleKeydown} />

{#snippet MenuButton(action: (typeof quickActions)[0], idx: number)}
	{@const Icon = action.icon}
	<button
		onclick={action.handler}
		class="quick-action-item {activeOptionIndex === idx ? 'active quick-action-active' : ''}"
	>
		<Icon class="action-icon" />
		<span class="action-label">{action.label}</span>
		{#if activeOptionIndex === idx}
			<span class="enter-badge">Enter</span>
		{/if}
	</button>
{/snippet}

<BubbleMenu
	{editor}
	pluginKey="ai-bubble-menu"
	shouldShow={(props) => {
		const { editor: propsEditor, view } = props;
		if (!propsEditor || !propsEditor.isEditable || propsEditor.isDestroyed) return false;
		if (!view || propsEditor.view.dragging) return false;

		// Always show during AI confirmation (streaming or action bar)
		if (aiState === AIState.Confirmation) return true;

		if (propsEditor.isActive('ai-highlight')) return true;

		removeAIHighlight(propsEditor);
		aiState = AIState.Idle;
		aiResponse = '';
		return false;
	}}
	class="ai-bubble-container"
	options={{
		strategy: 'fixed',
		autoPlacement: {
			allowedPlacements: ['bottom-start', 'top-start']
		},
		scrollTarget: editor.view.dom.parentElement ?? undefined,
		onShow() {
			activeOptionIndex = 0;
			inputTag?.focus();
		},
		onHide() {
			inputTag?.blur();
		}
	}}
>
	{#if statusMessage}
		<div class="status-message-bar">
			{statusMessage}
		</div>
	{/if}

	{#if aiState === AIState.Idle}
		<div class="panel-width">
			<!-- Input Area -->
			<form class="form-wrapper" onsubmit={handleSubmit}>
				<textarea
					bind:value={inputValue}
					bind:this={inputTag}
					oninput={handleInput}
					rows={1}
					placeholder="Ask AI anything..."
					class="input-textarea"></textarea>
				<button type="submit" class="edra-btn edra-btn-primary edra-btn-icon send-btn"
					><Send class="action-icon" /></button
				>
			</form>

			{#if isAIActive() && inputValue.trim()?.length === 0}
				<!-- Quick Actions List -->
				<div transition:slide={{ axis: 'y', duration: 250 }} class="actions-list">
					{#each quickActions as action, idx (action.id)}
						{@render MenuButton(action, idx)}
					{/each}
				</div>
			{/if}
		</div>
	{:else if aiState === AIState.Confirmation}
		{#if generating}
			<!-- AI is writing -->
			<div transition:fade class="loading-inner-wrapper">
				<div class="loading-row">
					<Sparkle class="animate-sparkle sparkle-icon" />
					<span class="txt-ink font-semibold">AI is writing...</span>
				</div>
			</div>
		{:else}
			<!-- Action bar -->
			<div transition:fade class="confirmation-row">
				<button class="edra-btn edra-btn-primary h-8-btn text-xs-btn" onclick={replaceSelection}>
					<Check class="action-icon" />
					Replace
				</button>
				<button class="edra-btn h-8-btn text-xs-btn" onclick={insertNext}>
					<CornerDownLeft class="action-icon" />
					Insert
				</button>
				<button class="edra-btn h-8-btn text-xs-btn" onclick={copyToClipboard}>
					<Copy class="action-icon" />
					Copy
				</button>
				<button class="edra-btn h-8-btn text-xs-btn" onclick={retry}>
					<RotateCcw class="action-icon" />
					Retry
				</button>
				<button class="edra-btn edra-btn-destructive h-8-btn text-xs-btn" onclick={discardChanges}>
					<Trash2 class="action-icon" />
					Discard
				</button>
			</div>
		{/if}
	{/if}
</BubbleMenu>

<style>
	.quick-action-item {
		border: 0;
		text-align: left;
		background-color: transparent;
		color: var(--edra-body);
		cursor: default;
		outline: none;
		gap: 0.375rem;
		border-radius: var(--edra-radius-sm);
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
		padding: 0.375rem 0.5rem;
		font-size: 0.875rem;
		transition: background-color 150ms ease;
	}
	.quick-action-item.active {
		background-color: var(--edra-canvas-soft-2);
		color: var(--edra-ink);
	}
	:global(.action-icon) {
		width: 1rem;
		height: 1rem;
	}
	.action-label {
		flex: 1;
		font-weight: 500;
		margin-left: 0.5rem;
	}
	.enter-badge {
		background-color: var(--edra-canvas);
		color: var(--edra-mute);
		font-size: 10px;
		border: 1px solid var(--edra-border);
		padding: 2px 6px;
		border-radius: var(--edra-radius-sm);
	}
	:global(.ai-bubble-container) {
		background-color: var(--edra-canvas);
		max-height: 30rem;
		max-width: 48rem;
		width: fit-content;
		box-shadow: var(--edra-shadow-5);
		border-radius: var(--edra-radius-lg);
		z-index: 100;
		display: flex;
		flex-direction: column;
		border: 1px solid var(--edra-border);
		padding: 0;
	}
	.status-message-bar {
		color: var(--edra-body);
		background-color: var(--edra-canvas-soft);
		border-top-left-radius: var(--edra-radius-lg);
		border-top-right-radius: var(--edra-radius-lg);
		padding: 0.375rem 0.75rem;
		font-size: 0.75rem;
		border-bottom: 1px solid var(--edra-border);
	}
	.panel-width {
		width: 24rem;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.form-wrapper {
		border-bottom: 1px solid var(--edra-border);
		padding: 0.75rem;
		display: flex;
		align-items: start;
		gap: 0.5rem;
	}
	.input-textarea {
		border: 0;
		outline: none;
		resize: none;
		height: auto;
		max-height: 10rem;
		background-color: transparent;
		color: var(--edra-ink);
		font-size: 0.875rem;
		width: 100%;
	}
	.input-textarea::placeholder {
		color: var(--edra-mute);
	}
	.send-btn {
		border-radius: var(--edra-radius-pill);
		width: 2rem;
		height: 2rem;
		flex-shrink: 0;
	}
	.actions-list {
		max-height: 18rem;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		padding: 0.375rem;
	}
	.loading-inner-wrapper {
		border-radius: var(--edra-radius-sm);
		padding: 2px;
	}
	.loading-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
	}
	:global(.sparkle-icon) {
		width: 1rem;
		height: 1rem;
	}
	:global(.animate-sparkle) {
		color: var(--edra-ink);
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}
	.txt-ink {
		color: var(--edra-ink);
	}
	.font-semibold {
		font-weight: 600;
	}
	.confirmation-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		border-radius: var(--edra-radius-lg);
	}
	.h-8-btn {
		height: 2rem;
		padding-left: 0.625rem;
		padding-right: 0.625rem;
	}
	.text-xs-btn {
		font-size: 0.75rem;
	}
</style>
