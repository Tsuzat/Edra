<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowRight, ArrowLeft } from '@lucide/svelte';
	import Code from '$lib/components/custom/docs/Code.svelte';

	const imageCode = `// Insert an image via URL
editor.commands.setImage({ src: 'https://example.com/image.png', alt: 'Example' });`;

	const uploadExample = `// Triggering the file upload sequence manually (e.g. from a custom button)
editor.commands.uploadMedia(file);`;

	const videoCode = `// Insert a video via URL
editor.commands.setVideo({ src: 'https://example.com/video.mp4' });`;

	const audioCode = `// Insert an audio file
editor.commands.setAudio({ src: 'https://example.com/audio.mp3' });`;

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
		Embed and configure images, videos, audio, iframes, and dynamic Mermaid diagrams directly within
		the editor.
	</p>

	<hr class="my-6" />

	<h2>Handling Uploads & Media Placeholders</h2>
	<p>
		Edra provides a seamless media uploading experience out of the box. When a user drags and drops
		a file, pastes an image from their clipboard, or uses the Slash Command to upload a file, Edra
		inserts a <code>MediaPlaceholder</code> node into the document.
	</p>
	<p>
		This placeholder displays a beautiful loading animation while your <code>onFileUpload</code>
		callback (configured during <code>createEditor</code>) processes the file. Once the upload
		resolves, the placeholder is automatically swapped out for the appropriate media node (Image,
		Video, or Audio).
	</p>
	<div class="my-4">
		<Code code={uploadExample} language="typescript" />
	</div>

	<hr class="my-6" />

	<h2>Images</h2>
	<p>
		Edra extends standard images using the custom <code>ImageExtended</code> extension. This includes
		sizing wrappers, captions, alignment toggles (left, right, center), and resizing handles.
	</p>
	<div class="my-4">
		<Code code={imageCode} language="typescript" />
	</div>

	<hr class="my-6" />

	<h2>Videos & Audio</h2>
	<p>
		Videos are rendered using the <code>VideoExtended</code> wrapper, and audio is rendered using
		the custom <code>Audio</code> extension. Both support captions and alignment.
	</p>
	<div class="my-4">
		<Code code={videoCode} language="typescript" />
	</div>
	<div class="my-4">
		<Code code={audioCode} language="typescript" />
	</div>

	<hr class="my-6" />

	<h2>Iframes & HTML Pasting</h2>
	<p>
		Edra allows you to embed YouTube, Vimeo, Spotify, Google Maps, and other external services
		natively using the <code>Iframe</code> extension.
	</p>

	<div class="callout my-6 rounded-md border-l-4 border-l-amber-500 bg-amber-500/10 p-4">
		<p class="m-0 font-medium text-amber-700 dark:text-amber-400">Pasting HTML Embeds</p>
		<p class="m-0 mt-2 text-sm">
			Thanks to the built-in <code>iframePasteHandler</code>, users can simply copy the raw HTML
			embed code provided by platforms like YouTube (e.g.,
			<code>&lt;iframe src="..."&gt;&lt;/iframe&gt;</code>) and paste it directly into the editor.
			Edra will intercept the paste, parse the HTML, and automatically convert it into a functional
			iframe block!
		</p>
	</div>

	<hr class="my-6" />

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
