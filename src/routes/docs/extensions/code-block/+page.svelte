<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowRight, ArrowLeft } from '@lucide/svelte';
	import Code from '$lib/components/custom/docs/Code.svelte';

	const codeblockSnippet = `// Run command to insert or toggle a code block:
editor.chain().focus().toggleCodeBlock().run();`;
</script>

<svelte:head>
	<title>Codeblock | Edra Docs</title>
</svelte:head>

<article class="prose dark:prose-invert max-w-none">
	<h1>Codeblock Extension</h1>
	<p class="lead">
		Format program snippets with multi-language syntax highlighting, a copy-to-clipboard trigger,
		and interactive diagram conversion.
	</p>

	<hr class="my-6" />

	<h2>Configuration</h2>
	<p>
		The editor wraps TipTap's standard <code>CodeBlockLowlight</code> extension, configuring it with
		the lightweight <code>lowlight</code> highlighter, and overlays it with a premium Svelte Node
		View component (<code>CodeBlock.svelte</code>).
	</p>
	<div class="my-4">
		<Code code={codeblockSnippet} language="typescript" />
	</div>

	<h2>Included Features</h2>
	<ul class="mt-4 list-disc space-y-2 pl-6">
		<li>
			<strong>Multi-Language Highlight:</strong> Automatically detects languages or lets users select
			the syntax format using a clean, search-enabled Popover dropdown.
		</li>
		<li>
			<strong>Mermaid Conversion:</strong> When the code block is set to <code>mermaid</code>, a
			one-click convert option appears to render your code into a visual flowchart or sequence
			diagram immediately.
		</li>
		<li>
			<strong>Copy Button:</strong> An inline clipboard button lets readers duplicate code blocks instantly.
		</li>
		<li>
			<strong>Editable Code Area:</strong> Full control to add, edit, or adjust syntax within standard
			HTML pre/code elements without breaking layout hierarchy.
		</li>
	</ul>

	<div class="mt-12 flex justify-between">
		<Button href="/docs/extensions/drag-handle" variant="outline" class="gap-2">
			<ArrowLeft class="size-4" />
			Back to Drag Handle
		</Button>
		<Button href="/docs/extensions/ai" class="gap-2">
			AI Assistant
			<ArrowRight class="size-4" />
		</Button>
	</div>
</article>
