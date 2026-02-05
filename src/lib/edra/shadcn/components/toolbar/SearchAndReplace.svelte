<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils.js';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import CaseSensitive from '@lucide/svelte/icons/case-sensitive';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Replace from '@lucide/svelte/icons/replace';
	import ReplaceAll from '@lucide/svelte/icons/replace-all';
	import Search from '@lucide/svelte/icons/search';
	import type { Editor } from '@tiptap/core';
	import { slide } from 'svelte/transition';
	import EdraToolTip from '../EdraToolTip.svelte';
	import { getKeyboardShortcut } from '../../../utils.js';
	import strings from '../../../strings.js';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();

	let open = $state(false);
	let showMore = $state(false);

	let searchText = $state('');
	let replaceText = $state('');
	let caseSensitive = $state(false);

	let searchIndex = $derived(editor.storage?.searchAndReplace?.resultIndex);
	let searchCount = $derived(editor.storage?.searchAndReplace?.results.length);

	function updateSearchTerm(clearIndex = false) {
		if (clearIndex) editor.commands.resetIndex();

		editor.commands.setSearchTerm(searchText);
		editor.commands.setReplaceTerm(replaceText);
		editor.commands.setCaseSensitive(caseSensitive);
	}

	function goToSelection() {
		const { results, resultIndex } = editor.storage.searchAndReplace;
		const position = results[resultIndex];
		if (!position) return;
		editor.commands.setTextSelection(position);
		const { node } = editor.view.domAtPos(editor.state.selection.anchor);
		if (node instanceof HTMLElement) node.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}

	function replace() {
		editor.commands.replace();
		goToSelection();
	}

	const next = () => {
		editor.commands.nextSearchResult();
		goToSelection();
	};

	const previous = () => {
		editor.commands.previousSearchResult();
		goToSelection();
	};

	const clear = () => {
		searchText = '';
		replaceText = '';
		caseSensitive = false;
	};

	const replaceAll = () => editor.commands.replaceAll();

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) {
			e.preventDefault();
			open = false;
		} else if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
			e.preventDefault();
			open = true;
		}
	}
</script>

<svelte:document onkeydown={handleKeyDown} />

<Popover.Root
	bind:open
	onOpenChange={(value) => {
		if (value === false) {
			clear();
			updateSearchTerm();
		}
	}}
>
	<Popover.Trigger>
		<EdraToolTip
			tooltip={strings.toolbar.searchAndReplace.buttonTitle}
			shortCut={getKeyboardShortcut('F', true)}
		>
			<Button variant="ghost" size="icon">
				<Search />
			</Button>
		</EdraToolTip>
	</Popover.Trigger>
	<Popover.Content
		class="flex w-fit items-center gap-1 p-2"
		portalProps={{ disabled: true, to: undefined }}
	>
		<Button
			variant="ghost"
			size="icon"
			class={cn('size-7 transition-transform', showMore && 'bg-muted rotate-90')}
			onclick={() => (showMore = !showMore)}
			title={strings.toolbar.searchAndReplace.showMore}
		>
			<ChevronRight />
		</Button>
		<div class="flex size-full flex-col gap-1">
			<div class="flex w-full items-center gap-1">
				<Input
					placeholder={strings.toolbar.searchAndReplace.searchPlaceholder}
					bind:value={searchText}
					oninput={() => updateSearchTerm()}
					class="w-48"
				/>
				<span class="text-muted-foreground text-sm"
					>{searchCount > 0 ? searchIndex + 1 : 0}/{searchCount}
				</span>
				<EdraToolTip tooltip={strings.toolbar.searchAndReplace.caseSensitive}>
					<Button
						variant="ghost"
						size="icon"
						class={cn('size-7', caseSensitive && 'bg-muted')}
						onclick={() => {
							caseSensitive = !caseSensitive;
							updateSearchTerm();
						}}
					>
						<CaseSensitive />
					</Button>
				</EdraToolTip>
				<EdraToolTip tooltip={strings.toolbar.searchAndReplace.goToPrevious}>
					<Button
						variant="ghost"
						size="icon"
						class="size-7"
						onclick={previous}
						title={strings.toolbar.searchAndReplace.previous}
					>
						<ArrowLeft />
					</Button>
				</EdraToolTip>
				<EdraToolTip tooltip={strings.toolbar.searchAndReplace.goToNext}>
					<Button
						variant="ghost"
						size="icon"
						class="size-7"
						onclick={next}
						title={strings.toolbar.searchAndReplace.next}
					>
						<ArrowRight />
					</Button>
				</EdraToolTip>
			</div>
			{#if showMore}
				<div transition:slide class="flex w-full items-center gap-1">
					<Input
						placeholder={strings.toolbar.searchAndReplace.replacePlaceholder}
						bind:value={replaceText}
						oninput={() => updateSearchTerm()}
						class="w-48"
					/>
					<EdraToolTip tooltip={strings.toolbar.searchAndReplace.replace}>
						<Button variant="ghost" size="icon" class="size-7" onclick={replace}>
							<Replace />
						</Button>
					</EdraToolTip>
					<EdraToolTip tooltip={strings.toolbar.searchAndReplace.replaceAll}>
						<Button variant="ghost" size="icon" class="size-7" onclick={replaceAll}>
							<ReplaceAll />
						</Button>
					</EdraToolTip>
				</div>
			{/if}
		</div>
	</Popover.Content>
</Popover.Root>
