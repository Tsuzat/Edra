<script lang="ts">
	import { type Editor } from '@tiptap/core';
	import Undo from './icons/undo.svelte';
	import Redo from './icons/redo.svelte';
	// import { Separator } from '$lib/components/ui/separator/index.js';
	import Bold from './icons/bold.svelte';
	import Italic from './icons/italic.svelte';
	import Underline from './icons/underline.svelte';
	import Strikethrough from './icons/strikethrough.svelte';
	import Link from './icons/link.svelte';
	import Code from './icons/code.svelte';
	import BlockQuote from './icons/block-quote.svelte';
	import Subscript from './icons/subscript.svelte';
	import ButtleList from './icons/buttle-list.svelte';
	import OrderedList from './icons/ordered-list.svelte';
	import TaskList from './icons/task-list.svelte';
	import Highlighter from './icons/highlighter.svelte';
	import Superscript from './icons/superscript.svelte';
	import Textcolor from './icons/textcolor.svelte';
	import Align from './icons/textalign.svelte';
	import Quickcolor from './icons/quickcolor.svelte';
	import Table from './icons/table.svelte';
	import Image from './icons/image.svelte';
	import Text from './icons/text.svelte';
	import SearchReplace from './icons/search-replace.svelte';

	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();
</script>

<div class="flex w-full items-center overflow-auto border-b p-1 *:mx-1">
	<Undo {editor} />
	<Redo {editor} />
	<!-- <Separator orientation="vertical" class="h-fit" /> -->
	<Text {editor} />
	<Bold {editor} />
	<Italic {editor} />
	<Underline {editor} />
	<Strikethrough {editor} />
	<Align {editor} />
	<Link {editor} />
	<Code {editor} />
	<BlockQuote {editor} />
	<Subscript {editor} />
	<Superscript {editor} />
	<ButtleList {editor} />
	<OrderedList {editor} />
	<TaskList {editor} />
	<Image {editor} />
	<Table {editor} />
	<Textcolor {editor} />
	<Highlighter {editor} />
	<Quickcolor {editor} />
	<SearchReplace {editor} />
</div>
