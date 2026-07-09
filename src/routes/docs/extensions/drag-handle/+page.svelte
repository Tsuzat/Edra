<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowRight, ArrowLeft } from '@lucide/svelte';
	import Code from '$lib/components/custom/docs/Code.svelte';
	import { setUpCode } from './code.ts';
</script>

<svelte:head>
	<title>Drag Handle | Edra Docs</title>
</svelte:head>

<article class="prose dark:prose-invert max-w-none">
	<h1>Drag Handle Extension</h1>
	<p class="lead">
		Rearrange content blocks, select full lines, apply formatting, and invoke block-level commands
		via hover handles.
	</p>

	<hr class="my-6" />

	<h2>Overview</h2>
	<p>
		The drag handle hover container is powered by <code>@tiptap/extension-drag-handle</code>. Edra
		encapsulates this with a custom dropdown menu that follows the cursor as you hover over
		paragraphs, headings, code blocks, lists, and tables.
	</p>

	<h2>Setup</h2>
	<p>
		To enable the drag handle interface, simply place the <code>&lt;Edra.DragHandle /&gt;</code>
		element inside the main <code>&lt;Edra&gt;</code> wrapping block:
	</p>
	<div class="my-4">
		<Code code={setUpCode} language="svelte" />
	</div>

	<h2>Key Actions in Hover Dropdown</h2>
	<ul class="list-disc pl-6 space-y-2 mt-4">
		<li>
			<strong>Block Movement:</strong> Press, hold, and drag the handle icon to physically reposition
			paragraphs, list items, or blocks anywhere else in the document.
		</li>
		<li>
			<strong>Content Switcher:</strong> Click the plus (<code>+</code>) menu to add new blocks or
			convert the current line into a Heading, Checklist, Bullet List, or Blockquote.
		</li>
		<li>
			<strong>Node Actions:</strong> Quickly duplicate block content, copy text, delete elements, align
			text blocks, or remove inline styling formats.
		</li>
		<li>
			<strong>AI Integration:</strong> If an AI provider is active, run custom prompt transformations
			directly on the hovered block.
		</li>
	</ul>

	<div class="mt-12 flex justify-between">
		<Button href="/docs/extensions/callout" variant="outline" class="gap-2">
			<ArrowLeft class="size-4" />
			Back to Callouts
		</Button>
		<Button href="/docs/extensions/code-block" class="gap-2">
			Codeblock
			<ArrowRight class="size-4" />
		</Button>
	</div>
</article>
