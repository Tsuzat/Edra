<script lang="ts">
	import { tick } from 'svelte';
	import { fade, slide } from 'svelte/transition';
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
	import {
		BubbleMenu,
		Editor,
		getEditor,
		removeAIHighlight,
		useEditorState
	} from '$lib/edra/tiptap/index.js';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import CheckCheck from '@lucide/svelte/icons/check-check';
	import ArrowDownWideNarrow from '@lucide/svelte/icons/arrow-down-wide-narrow';
	import TextWrap from '@lucide/svelte/icons/text-wrap';
	import Feather from '@lucide/svelte/icons/feather';
	import RefreshCcwDot from '@lucide/svelte/icons/refresh-ccw-dot';
	import PenLine from '@lucide/svelte/icons/pen-line';
	import Brain from '@lucide/svelte/icons/brain';
	import Sparkle from '@lucide/svelte/icons/sparkle';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Check, Copy, CornerDownLeft, RotateCcw, Trash2 } from '@lucide/svelte';

	let inputTag = $state<HTMLTextAreaElement | null>(null);
	const editor = getEditor();

	const activeCallAI = $derived(
		editor.extensionManager.extensions.find((e) => e.name === 'ai-highlight')?.options?.callAI
	);
	const editorState = useEditorState({
		editor,
		selector: ({ editor }) => ({
			isAIActive: editor.isActive('ai-highlight')
		})
	});
	let errorText = $state('');
	let capturedText = $state('');

	function getAIHighlightedText(editor: Editor): string {
		let text = '';
		if (!editor.state) return '';
		editor.state.doc.descendants((node) => {
			if (node.isText && node.marks.some((mark) => mark.type.name === 'ai-highlight')) {
				text += node.text || '';
			}
		});
		return text;
	}

	let inputValue = $state('');
	let aiState = $state(AIState.Idle);
	let aiResponse = $state('');
	let activeOptionIndex = $state(0);
	let generating = $state(false);

	// Position tracking for inline editor streaming
	let originalFrom = $state(0);
	let aiContentFrom = $state(0);
	let aiContentTo = $state(0);
	let lastPrompt = $state('');
	let updateTimer: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		const updateCapturedText = () => {
			if ($editorState.isAIActive) {
				capturedText = getAIHighlightedText(editor);
			} else {
				capturedText = '';
			}
		};
		updateCapturedText();
		editor.on('transaction', updateCapturedText);
		return () => {
			editor.off('transaction', updateCapturedText);
		};
	});

	async function processText(
		type:
			'shorter' | 'longer' | 'summarize' | 'grammer' | 'continue' | 'solve' | 'improve' | 'simplify'
	) {
		errorText = '';
		const selectedText = capturedText;
		if (!selectedText || selectedText.trim().length === 0) {
			errorText = 'Can not get the selected content from editor';
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
			generating = true;
			await tick();
			await generateAIContent(prompt);
		} catch (error) {
			aiState = AIState.Idle;
			console.error(error);
			errorText = 'Something went wrong! Check console.';
		}
	}

	async function handleSubmit(e?: Event) {
		if (e) e.preventDefault();
		if (!inputValue || inputValue.trim().length === 0) return;
		const text = capturedText;
		if (!text) return;
		errorText = '';
		try {
			const prompt = `${text}\n\n\n${inputValue}`;
			inputValue = '';
			if (inputTag) inputTag.style.height = 'auto';
			aiState = AIState.Confirmation;
			generating = true;
			await tick();
			await generateAIContent(prompt);
		} catch (error) {
			aiState = AIState.Idle;
			console.error(error);
			errorText = 'Something went wrong! Check console.';
		}
	}

	async function generateAIContent(prompt: string) {
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
				errorText = 'Something went wrong when calling AI.';
				console.error(error);
				cleanupAIContent();
				aiState = AIState.Idle;
				aiResponse = '';
				generating = false;
			};
			if (activeCallAI) {
				await activeCallAI(prompt, onChunk, onError);
			} else {
				throw new Error('callAI function is not configured.');
			}
			// Final flush to ensure all content is rendered in the editor
			aiState = AIState.Confirmation;
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
		}, 300);
	}

	/** Insert or replace the AI content region in the editor with the accumulated response */
	function flushEditorUpdate() {
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
					color: '#e8f5e940'
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
			errorText = 'Unable to replace. Copy content and paste manually.';
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
			// If still generating, just mark for cleanup
			generating = false;
		}
		cleanupAIContent();
		removeAIHighlight(editor);
		aiState = AIState.Idle;
		aiResponse = '';
		lastPrompt = '';
		errorText = '';
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
		if ($editorState.isAIActive === false && aiState !== AIState.Confirmation) return;

		if (event.key === 'Escape') {
			event.preventDefault();
			closeAI();
			return;
		}

		if (aiState === AIState.Idle) {
			const showQuickActions = capturedText.trim().length && inputValue.trim()?.length === 0;
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
		class="focus:bg-accent p-1.5 focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive not-data-[variant=destructive]:focus:**:text-accent-foreground gap-1.5 rounded-md px-1.5 py-1 text-sm data-inset:pl-7 [&_svg:not([class*='size-'])]:size-4 group/dropdown-menu-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 w-full transition-colors {activeOptionIndex ===
		idx
			? 'bg-accent text-accent-foreground quick-action-active'
			: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}"
	>
		<Icon />
		<span class="flex-1 text-start font-medium ml-2">{action.label}</span>
		{#if activeOptionIndex === idx}
			<span class="text-xs text-muted-foreground">Enter</span>
		{/if}
	</button>
{/snippet}

<BubbleMenu
	{editor}
	pluginKey="edra-bubble-menu"
	shouldShow={(props) => {
		if (!props.editor.isEditable || props.editor.isDestroyed) return false;
		const { view, editor } = props;
		if (!view || editor.view.dragging) return false;

		if (errorText) return true;

		// Always show during AI confirmation (streaming or action bar)
		if (aiState === AIState.Confirmation) return true;

		if (props.editor.isActive('ai-highlight')) return true;

		return false;
	}}
	class="bg-popover/75 backdrop-blur-2xl rounded-lg flex max-h-120 max-w-3xl w-full flex-col p-0 transition-[height] duration-500 z-100"
	options={{
		strategy: 'fixed',
		autoPlacement: {
			allowedPlacements: ['bottom-start', 'top-start']
		},
		scrollTarget: editor.view.dom.parentElement ?? window,
		onShow() {
			activeOptionIndex = 0;
			inputTag?.focus();
		},
		onHide() {
			inputTag?.blur();
			if (!generating) {
				cleanupAIContent();
				removeAIHighlight(editor);
				aiState = AIState.Idle;
				aiResponse = '';
			}
		}
	}}
>
	{#if errorText}
		<div
			transition:fade
			class="flex items-center gap-3 border shadow-2xl justify-between p-2.5 rounded-lg bg-popover max-w-md w-full"
		>
			<span class="text-destructive text-sm font-medium flex-1 pl-1">{errorText}</span>
			<Button variant="outline" size="sm" onclick={closeAI}>Close</Button>
		</div>
	{:else if aiState === AIState.Idle}
		<div class="shadow-2xl w-xl border backdrop-blur-2xl rounded-xl flex flex-col overflow-hidden">
			<!-- Input Area -->
			<div class="px-3 py-3">
				<textarea
					bind:value={inputValue}
					bind:this={inputTag}
					oninput={handleInput}
					rows={1}
					placeholder="Ask AI anything..."
					class="w-full border-0 outline-hidden resize-none h-auto max-h-40"></textarea>
			</div>

			{#if capturedText.trim().length && inputValue.trim()?.length === 0}
				<!-- Quick Actions List -->
				<div
					transition:slide={{ axis: 'y', duration: 250 }}
					class="flex flex-col p-1.5 max-h-72 overflow-y-auto"
				>
					{#each quickActions as action, idx (action.id)}
						{@render MenuButton(action, idx)}
					{/each}
				</div>
			{/if}
		</div>
	{:else if aiState === AIState.Confirmation}
		{#if generating}
			<!-- AI is writing — content streams directly into editor -->
			<div transition:fade class="animated-gradient-border rounded-lg p-0.5">
				<div class="flex bg-popover items-center gap-2 rounded-lg p-2">
					<Sparkle class="size-4!" />
					<span
						class="bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text font-bold text-transparent"
					>
						AI is writing</span
					>
					<div class="flex h-5 items-center space-x-1">
						{#each Array(3) as idx, i (i)}
							<div
								data-id={idx}
								class="bg-primary h-1 w-1 animate-[bounce-dots_1.4s_ease-in-out_infinite] rounded-full"
								style:animation-delay="{i * 160}ms"
							></div>
						{/each}
						<span class="sr-only">Loading</span>
					</div>
				</div>
			</div>
		{:else}
			<!-- Action bar — AI has finished streaming into editor -->
			<div
				transition:fade
				class="flex items-center gap-2 border shadow-2xl justify-between p-2 rounded-lg"
			>
				<!-- Left: Replace, Insert, Copy -->
				<Button size="sm" onclick={replaceSelection}>
					<Check />
					Replace
				</Button>
				<Button variant="outline" size="sm" onclick={insertNext}>
					<CornerDownLeft />
					Insert
				</Button>
				<Button variant="outline" size="sm" onclick={copyToClipboard}>
					<Copy />
					Copy
				</Button>
				<Button variant="outline" size="sm" onclick={retry}>
					<RotateCcw />
					Retry
				</Button>
				<Button variant="destructive" size="sm" onclick={discardChanges}>
					<Trash2 />
					Discard
				</Button>
			</div>
		{/if}
	{/if}
</BubbleMenu>

<style>
	@property --angle {
		syntax: '<angle>';
		inherits: false;
		initial-value: 0deg;
	}
	@keyframes rotate {
		to {
			--angle: 360deg;
		}
	}
	.animated-gradient-border {
		background: conic-gradient(from var(--angle), #e50909, #c8b207, #e608e6, #6eec07);
		animation: rotate 3s linear infinite;
		border-radius: 12px !important;
	}
</style>
