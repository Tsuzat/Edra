<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowRight, ArrowLeft } from '@lucide/svelte';
	import Code from '$lib/components/custom/docs/Code.svelte';

	const tableSnippet = `import { Table, TableRow, TableHeader, TableCell } from '$lib/edra/tiptap/index.js';

// Table extensions are included in the default extensions list.
// Inside your code, you can run commands on the editor instance:
editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();`;
</script>

<svelte:head>
	<title>Tables | Edra Docs</title>
</svelte:head>

<article class="prose dark:prose-invert max-w-none">
	<h1>Tables Extension</h1>
	<p class="lead">
		Add rich, interactive tables into your documents with rows, columns, headers, and full keyboard
		navigation.
	</p>

	<hr class="my-6" />

	<h2>Usage</h2>
	<p>
		The Table suite consists of <code>Table</code>, <code>TableRow</code>, <code>TableHeader</code>,
		and <code>TableCell</code> extensions. Edra integrates these custom extensions directly into its default
		configuration.
	</p>

	<div class="my-4">
		<Code code={tableSnippet} language="typescript" />
	</div>

	<h2>Keyboard Shortcuts & Commands</h2>
	<p>
		The table extension supports intuitive keyboard navigation and a set of command chains to
		programmatically alter table layout:
	</p>
	<ul class="mt-4 list-disc space-y-2 pl-6">
		<li>
			<code>insertTable(&#123; rows, cols, withHeaderRow &#125;)</code>: Inserts a new table at the
			current cursor position.
		</li>
		<li>
			<code>addColumnBefore() / addColumnAfter()</code>: Adds a column to the left or right of the
			active cell.
		</li>
		<li><code>deleteColumn()</code>: Removes the current column.</li>
		<li><code>addRowBefore() / addRowAfter()</code>: Adds a row above or below the active cell.</li>
		<li><code>deleteRow()</code>: Removes the current row.</li>
		<li><code>deleteTable()</code>: Removes the entire table.</li>
	</ul>

	<h2>Styling</h2>
	<p>
		Edra applies custom borders, spacing, and header styling inside <code>editor.css</code> so that tables
		match your theme out of the box (with horizontal borders, row highlights, and clean padding).
	</p>

	<div class="mt-12 flex justify-between">
		<Button href="/docs/extensions/starter-kit" variant="outline" class="gap-2">
			<ArrowLeft class="size-4" />
			Back to Starter Kit
		</Button>
		<Button href="/docs/extensions/tasks" class="gap-2">
			Tasks Extension
			<ArrowRight class="size-4" />
		</Button>
	</div>
</article>
