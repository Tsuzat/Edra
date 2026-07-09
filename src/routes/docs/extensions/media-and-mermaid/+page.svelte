<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowRight, ArrowLeft } from '@lucide/svelte';
	import Code from '$lib/components/custom/docs/Code.svelte';

	const imageCode = `// Insert image
editor.commands.setImage({ src: 'https://example.com/image.png', alt: 'Example' });`;

	const videoCode = `// Insert video
editor.commands.setVideo({ src: 'https://example.com/video.mp4' });`;

	const mermaidCode = `// Mermaid diagram codeblock syntax
\`\`\`mermaid
graph TD
    A[Start] --> B(Process)
    B --> C{Decision}
    C -->|Yes| D[Success]
    C -->|No| E[Fail]
\`\`\``;
</script>

<svelte:head>
	<title>Media & Mermaid | Edra Docs</title>
</svelte:head>

<article class="prose dark:prose-invert max-w-none">
	<h1>Media & Mermaid</h1>
	<p class="lead">
		Embed and configure images, videos, iframes, and dynamic Mermaid diagrams directly within the
		editor.
	</p>

	<hr class="my-6" />

	<h2>Images</h2>
	<p>
		Edra extends standard images using the custom <code>ImageExtended</code> extension. This includes
		sizing wrappers, captions, alignment toggles (left, right, center), and resizing handles.
	</p>
	<div class="my-4">
		<Code code={imageCode} language="typescript" />
	</div>

	<h2>Videos & Iframes</h2>
	<p>
		Videos are rendered using the <code>VideoExtended</code> wrapper. Iframes are supported, allowing
		you to embed YouTube, Vimeo, and other external services by pasting URLs or embeds.
	</p>
	<div class="my-4">
		<Code code={videoCode} language="typescript" />
	</div>

	<h2>Mermaid Diagrams</h2>
	<p>
		Edra contains native support for rendering Mermaid diagrams. Create a code block and set the
		language identifier to <code>mermaid</code> to instantly render full diagram schemas in the page:
	</p>
	<div class="my-4">
		<Code code={mermaidCode} language="markdown" />
	</div>

	<div class="mt-12 flex justify-between">
		<Button href="/docs/extensions/markdown" variant="outline" class="gap-2">
			<ArrowLeft class="size-4" />
			Back to Markdown
		</Button>
		<Button href="/docs/extensions/callout" class="gap-2">
			Callouts Extension
			<ArrowRight class="size-4" />
		</Button>
	</div>
</article>
