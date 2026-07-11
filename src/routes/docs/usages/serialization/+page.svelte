<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowRight, ArrowLeft } from '@lucide/svelte';
	import Code from '$lib/components/custom/docs/Code.svelte';

	const jsonCode = `// Extract the document as a structured JSON AST
const data = editor.getJSON();

// Load the document back from JSON
editor.commands.setContent(data);`;

	const htmlCode = `// Extract the document as an HTML string
const html = editor.getHTML();

// Load the document back from HTML
editor.commands.setContent(html);`;

	const markdownCode = `// Extract the document as Markdown
// Ensure the Markdown extension is loaded in your extensions list!
const markdown = editor.getMarkdown();

// Load the document back from Markdown
editor.commands.setContent(markdown);`;
</script>

<svelte:head>
	<title>Data & Serialization | Edra Docs</title>
</svelte:head>

<article class="prose dark:prose-invert max-w-none">
	<h1>Data & Serialization</h1>
	<p class="lead">Extracting, saving, and loading content in JSON, HTML, or Markdown formats.</p>

	<hr class="my-6" />

	<h2>JSON (Recommended)</h2>
	<p>
		The most robust way to store Edra's content is by using TipTap's native JSON format. JSON
		perfectly captures all nested attributes, extensions, node configurations (like image alignments
		or cell widths in tables), and custom marks.
	</p>
	<div class="my-4">
		<Code code={jsonCode} language="typescript" />
	</div>

	<div class="callout my-6 rounded-md border-l-4 border-l-blue-500 bg-blue-500/10 p-4">
		<p class="m-0 font-medium text-blue-700 dark:text-blue-400">Why JSON over HTML?</p>
		<p class="m-0 mt-2 text-sm">
			HTML serialization relies on parsing tags and attributes, which can sometimes result in lost
			data if the DOM changes or if specific inline styles are stripped by sanitizers. JSON provides
			a guaranteed 1:1 mapping of your editor state.
		</p>
	</div>

	<hr class="my-6" />

	<h2>HTML</h2>
	<p>
		If you need to render the document's content in an email template or a simplified frontend
		reader, extracting it as raw HTML is incredibly useful.
	</p>
	<div class="my-4">
		<Code code={htmlCode} language="typescript" />
	</div>

	<hr class="my-6" />

	<h2>Markdown</h2>
	<p>
		Edra integrates <code>@tiptap/markdown</code>, allowing seamless conversion between Markdown and
		the rich text editor state. This is highly useful for Git-backed CMSs or legacy integrations.
	</p>
	<div class="my-4">
		<Code code={markdownCode} language="typescript" />
	</div>

	<p>
		Note that Markdown does not natively support all of Edra's advanced extensions (like media
		alignment, custom iframe styling, or text colors). When serializing to Markdown, these advanced
		attributes may be stripped.
	</p>

	<div class="mt-12 flex justify-between">
		<Button href="/docs/usages" variant="outline" class="gap-2">
			<ArrowLeft class="size-4" />
			Usages
		</Button>
		<Button href="/docs/extensions/starter-kit" class="gap-2">
			Starter Kit
			<ArrowRight class="size-4" />
		</Button>
	</div>
</article>
