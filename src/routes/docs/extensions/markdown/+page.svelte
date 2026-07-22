<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowLeft } from '@lucide/svelte';
	import Code from '$lib/components/custom/docs/Code.svelte';

	const markdownSnippet = `import { Markdown } from '@tiptap/markdown';

// Enabled by default in extensions.ts
// Allows outputting content as markdown string:
const markdownOutput = editor.getMarkdown();

// Or setting content using markdown:
editor.commands.setContent(\`# Title\\nThis is **bold** text.\`, true);`;
</script>

<svelte:head>
	<title>Markdown | Edra Docs</title>
</svelte:head>

<article class="prose dark:prose-invert max-w-none">
	<h1>Markdown Extension</h1>
	<p class="lead">
		Read and write clean markdown strings directly from the editor instance, allowing seamless
		content migrations.
	</p>

	<hr class="my-6" />

	<h2>Usage</h2>
	<p>
		The editor includes <code>@tiptap/markdown</code> in its default extensions list. This enables
		full markdown shortcuts while typing (e.g. typing <code># </code> transforms into a Heading 1) and
		provides getters/setters to communicate in markdown format:
	</p>

	<div class="my-4">
		<Code code={markdownSnippet} language="typescript" />
	</div>

	<h2>Pasting & Keyboard Shortcuts</h2>
	<ul class="mt-4 list-disc space-y-2 pl-6">
		<li>
			<strong>Paste Markdown:</strong> Pasting raw markdown text into the editor automatically parses
			and styles it appropriately (bold, italic, list format).
		</li>
		<li>
			<strong>Typing Shortcuts:</strong> Use standard markdown indicators (e.g. <code>*</code>,
			<code>-</code>, <code>1.</code>, <code>&gt;</code>, <code>\`\`\`</code>) at the start of a
			block to instantly format headings, lists, quotes, and code blocks.
		</li>
	</ul>

	<div class="mt-12 flex">
		<Button href="/docs/extensions/mathematics" variant="outline" class="gap-2">
			<ArrowLeft class="size-4" />
			Back to Mathematics
		</Button>
	</div>
</article>
