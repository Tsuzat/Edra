<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import CaseSensitive from '@lucide/svelte/icons/case-sensitive';
	import Replace from '@lucide/svelte/icons/replace';
	import ReplaceAll from '@lucide/svelte/icons/replace-all';
	import Search from '@lucide/svelte/icons/search';
	import strings from '../../../strings.js';

	interface Props {
		editor: Editor;
		show: boolean;
	}

	let { editor, show = $bindable(false) }: Props = $props();

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
		editor.commands.resetIndex();
	};

	const replaceAll = () => editor.commands.replaceAll();
</script>

<div class="edra-search-and-replace">
	<button
		class="edra-command-button"
		onclick={() => {
			show = !show;
			clear();
			updateSearchTerm();
		}}
		title={show
			? strings.toolbar.searchAndReplace.goBack
			: strings.toolbar.searchAndReplace.searchAndReplace}
	>
		{#if show}
			<ArrowLeft class="edra-toolbar-icon" />
		{:else}
			<Search class="edra-toolbar-icon" />
		{/if}
	</button>
	{#if show}
		<div class="edra-search-and-replace-content">
			<input
				placeholder={strings.toolbar.searchAndReplace.searchPlaceholder}
				bind:value={searchText}
				oninput={() => updateSearchTerm()}
			/>
			<span>{searchCount > 0 ? searchIndex + 1 : 0}/{searchCount}</span>
			<button
				class="edra-command-button"
				class:active={caseSensitive}
				onclick={() => {
					caseSensitive = !caseSensitive;
					updateSearchTerm();
				}}
				title={strings.toolbar.searchAndReplace.caseSensitive}
			>
				<CaseSensitive class="edra-toolbar-icon" />
			</button>
			<button
				class="edra-command-button"
				onclick={previous}
				title={strings.toolbar.searchAndReplace.previous}
			>
				<ArrowLeft class="edra-toolbar-icon" />
			</button>
			<button
				class="edra-command-button"
				onclick={next}
				title={strings.toolbar.searchAndReplace.next}
			>
				<ArrowRight class="edra-toolbar-icon" />
			</button>
			<span class="separator"></span>

			<input
				placeholder={strings.toolbar.searchAndReplace.replacePlaceholder}
				bind:value={replaceText}
				oninput={() => updateSearchTerm()}
			/>
			<button
				class="edra-command-button"
				onclick={replace}
				title={strings.toolbar.searchAndReplace.replace}
			>
				<Replace class="edra-toolbar-icon" />
			</button>
			<button
				class="edra-command-button"
				onclick={replaceAll}
				title={strings.toolbar.searchAndReplace.replaceAll}
			>
				<ReplaceAll class="edra-toolbar-icon" />
			</button>
		</div>
	{/if}
</div>

<style>
	.separator {
		width: 1rem;
	}
</style>
