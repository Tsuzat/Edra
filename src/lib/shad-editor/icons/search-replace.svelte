<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { type Editor } from '@tiptap/core';
	import {
		ArrowLeft,
		ArrowRight,
		TextSearch,
		X,
		Replace,
		ReplaceAll,
		ChevronDown
	} from 'lucide-svelte';

	let { editor }: { editor: Editor } = $props();

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
		const position: Range = results[resultIndex];
		if (!position) return;
		//@ts-ignore
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
		editor.commands.resetIndex();
	};

	const replaceAll = () => editor.commands.replaceAll();
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Popover.Root
				onOpenChange={(open) => {
					if (open) updateSearchTerm();
					else {
						clear();
						updateSearchTerm(true);
					}
				}}
			>
				<Popover.Trigger>
					<Button variant="ghost" size="sm" class="h-8">
						<TextSearch />
						<ChevronDown class="size-3 text-muted-foreground" />
					</Button>
				</Popover.Trigger>
				<Popover.Content class="bg-popover shadow-lg *:my-2">
					<Popover.Close
						class="absolute right-2 top-0 text-muted-foreground"
						onclick={() => {
							clear();
							updateSearchTerm(true);
						}}
					>
						<X class="size-4" />
					</Popover.Close>
					<div class="flex items-center justify-between">
						<Input
							placeholder="Enter Text to search.."
							bind:value={searchText}
							oninput={() => updateSearchTerm()}
							class="mr-1 "
						/>
						<Button variant="ghost" class="ml-1 size-8" onclick={previous}>
							<ArrowLeft />
						</Button>
						<Button variant="ghost" class="ml-1 size-8" onclick={next}>
							<ArrowRight />
						</Button>
					</div>
					<div class="flex items-center justify-between">
						<Input
							placeholder="Enter Text to Replace.."
							bind:value={replaceText}
							oninput={() => updateSearchTerm()}
							class="mr-1 "
						/>
						<Button variant="ghost" class="ml-1 size-8" onclick={replace}>
							<Replace />
						</Button>
						<Button variant="ghost" class="ml-1 size-8" onclick={replaceAll}>
							<ReplaceAll />
						</Button>
					</div>

					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<input
								type="checkbox"
								class="checkbox"
								bind:checked={caseSensitive}
								onchange={() => updateSearchTerm()}
							/>
							<p>Case Sensitive</p>
						</div>
						<div class="flex items-center gap-2">
							{searchCount > 0 ? searchIndex + 1 : 0} / {searchCount}
						</div>
					</div>
				</Popover.Content>
			</Popover.Root>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Search And Replace Text</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
