<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowRight, ArrowLeft } from '@lucide/svelte';
	import Code from '$lib/components/custom/docs/Code.svelte';

	const calloutCode = `// Command to toggle or apply callout block
editor.commands.setCallout();`;

	const markdownSyntax = `$callout 💡
This is a callout box with a custom lightbulb emoji!
$`;

	const inputRule = `$callout ⚠️ `;
</script>

<svelte:head>
	<title>Callouts | Edra Docs</title>
</svelte:head>

<article class="prose dark:prose-invert max-w-none">
	<h1>Callouts Extension</h1>
	<p class="lead">
		Highlight key information, warnings, or tips in your documents with customizable callout blocks
		rendered using custom Svelte components.
	</p>

	<hr class="my-6" />

	<h2>Usage</h2>
	<p>
		The <code>Callout</code> extension is a custom TipTap Node that integrates a Svelte component view.
		It supports emojis, draggable states, and custom markdown rendering.
	</p>
	<div class="my-4">
		<Code code={calloutCode} language="typescript" />
	</div>

	<h2>Markdown Syntax & Parsing</h2>
	<p>
		Edra automatically parses callouts from markdown strings using a custom dollar-sign wrap syntax:
	</p>
	<div class="my-4">
		<Code code={markdownSyntax} language="markdown" />
	</div>

	<h2>Input Rules</h2>
	<p>
		You can instantly create a callout in the editor by typing <code>$callout</code> followed by an
		optional emoji and a space (e.g. <code>$callout ⚠️ </code>) at the start of any new paragraph.
	</p>
	<div class="my-4">
		<Code code={inputRule} language="markdown" />
	</div>

	<h2>Node Customization</h2>
	<p>
		The node view handles custom emoji Pickers, background color matching based on your theme, and
		draggable handles to move callout boxes easily in your doc layout.
	</p>

	<div class="mt-12 flex justify-between">
		<Button href="/docs/extensions/media-and-mermaid" variant="outline" class="gap-2">
			<ArrowLeft class="size-4" />
			Back to Media & Mermaid
		</Button>
		<Button href="/docs/extensions/drag-handle" class="gap-2">
			Drag Handle
			<ArrowRight class="size-4" />
		</Button>
	</div>
</article>
