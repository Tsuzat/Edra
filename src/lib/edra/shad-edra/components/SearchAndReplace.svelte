<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import type { Editor } from '@tiptap/core';
	import Search from 'lucide-svelte/icons/search';
	import EdraToolTip from './EdraToolTip.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';
	import ArrowRight from 'lucide-svelte/icons/arrow-right';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import CaseSensitive from 'lucide-svelte/icons/case-sensitive';
	import Replace from 'lucide-svelte/icons/replace';
	import ReplaceAll from 'lucide-svelte/icons/replace-all';
	import { cn } from '$lib/utils.js';
	import { slide } from 'svelte/transition';

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

	function updateSearchTerm(clearIndex: boolean = false) {
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
		node instanceof HTMLElement && node.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
		editor.commands.resetIndex();
	};

	const replaceAll = () => editor.commands.replaceAll();
</script>

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
		<EdraToolTip content="Search and Replace">
			<Button variant="ghost" size="icon" class="gap-0.5">
				<Search />
				<ChevronDown class="!size-2 text-muted-foreground" />
			</Button>
		</EdraToolTip>
	</Popover.Trigger>
	<Popover.Content
		class="flex w-fit items-center gap-1 p-2"
		portalProps={{ disabled: true, to: undefined }}
	>
		<Button
			variant="ghost"
			class={cn('size-6 rounded-sm p-0 transition-transform', showMore && 'rotate-90 bg-muted')}
			title="Show More"
			onclick={() => (showMore = !showMore)}
		>
			<ChevronRight />
		</Button>
		<div class="flex size-full flex-col gap-1">
			<div class="flex w-full items-center gap-1">
				<Input
					placeholder="Search..."
					bind:value={searchText}
					oninput={() => updateSearchTerm()}
					class="w-40"
				/>
				<span class="text-sm text-muted-foreground"
					>{searchCount > 0 ? searchIndex + 1 : 0}/{searchCount}
				</span>
				<Button
					variant="ghost"
					class={cn('size-6 rounded-sm p-0', caseSensitive && 'bg-muted')}
					onclick={() => {
						caseSensitive = !caseSensitive;
						updateSearchTerm();
					}}
					title="Case Sensitive"
				>
					<CaseSensitive />
				</Button>
				<Button variant="ghost" class="size-6 rounded-sm p-0" onclick={previous} title="Previous">
					<ArrowLeft />
				</Button>
				<Button variant="ghost" class="size-6 rounded-sm p-0" onclick={next} title="Next">
					<ArrowRight />
				</Button>
			</div>
			{#if showMore}
				<div transition:slide class="flex w-full items-center gap-1">
					<Input
						placeholder="Replace..."
						bind:value={replaceText}
						oninput={() => updateSearchTerm()}
						class="w-40"
					/>
					<Button variant="ghost" class="size-6 rounded-sm p-0" onclick={replace} title="Replace">
						<Replace />
					</Button>
					<Button
						variant="ghost"
						class="size-6 rounded-sm p-0"
						onclick={replaceAll}
						title="Replace All"
					>
						<ReplaceAll />
					</Button>
				</div>
			{/if}
		</div>
	</Popover.Content>
</Popover.Root>
