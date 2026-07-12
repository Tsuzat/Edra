<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowRight, ArrowLeft } from '@lucide/svelte';
	import Code from '$lib/components/custom/docs/Code.svelte';

	const propsInterface = `export interface EdraEditorProps {
	/** Callback invoked whenever the editor content or state changes */
	onUpdate?: () => void;
	
	/**
	 * Callback function to handle file uploads when a user drags/drops, pastes,
	 * or selects a media file (image, video, audio) to insert.
	 *
	 * @param file The file to be uploaded.
	 * @returns A promise resolving to the uploaded file's URL.
	 */
	onFileUpload?: (file: File) => Promise<string>;
	
	/**
	 * Callback to handle AI completion streaming. 
	 */
	callAI?: (
		prompt: string,
		onChunk: (chunk: string) => void,
		onError: (error: Error) => void
	) => Promise<void>;
}`;

	const initExample = `import { createEditor, Edra } from '$lib/edra/shadcn/index.js';

const editor = createEditor({
	onUpdate: () => {
		console.log('Editor content changed!', editor.getJSON());
	},
	onFileUpload: async (file: File) => {
		// Example: Uploading to Vercel Blob or an S3 bucket
		const response = await fetch('/api/upload', {
			method: 'POST',
			body: file
		});
		const data = await response.json();
		return data.url; // Return the public URL to embed it in the editor
	}
});`;
</script>

<svelte:head>
	<title>Configuration & API | Edra Docs</title>
</svelte:head>

<article class="prose dark:prose-invert max-w-none">
	<h1>Configuration & API</h1>
	<p class="lead">
		Learn how to instantiate Edra, configure its behavior, and hook into core events like media
		uploads and content updates.
	</p>

	<hr class="my-6" />

	<h2>Instantiating the Editor</h2>
	<p>
		Edra provides a <code>createEditor</code> function that returns a fully configured TipTap instance
		with all of Edra's custom extensions and event bindings attached.
	</p>

	<p>
		The <code>createEditor</code> function accepts an optional <code>EdraEditorProps</code> object:
	</p>
	<div class="my-4">
		<Code code={propsInterface} language="ts" />
	</div>

	<hr class="my-6" />

	<h2>Editor Props Breakdown</h2>

	<h3><code>onUpdate</code></h3>
	<p>
		This callback is fired whenever the document content changes. You can use it to sync the
		editor's state to your parent component, validate data, or trigger autosaves.
	</p>

	<h3><code>onFileUpload</code></h3>
	<p>
		Whenever a user pastes, drags and drops, or uses the Slash Menu to insert an Image, Video, or
		Audio file, Edra needs to know how to upload it to your storage provider (like AWS S3, Vercel
		Blob, Cloudinary, etc.).
	</p>
	<p>
		Edra will automatically render a beautiful loading placeholder in the document while this
		promise resolves. Once the promise resolves with a URL string, the placeholder is replaced with
		the actual media block.
	</p>

	<div class="callout my-6 rounded-md border-l-4 border-l-blue-500 bg-blue-500/10 p-4">
		<p class="m-0 font-medium text-blue-700 dark:text-blue-400">Note on Base64 Images</p>
		<p class="m-0 mt-2 text-sm">
			If you do not provide an <code>onFileUpload</code> callback, Edra will attempt to use standard base64
			data URIs for images. However, this is heavily discouraged for production as it severely degrades
			performance.
		</p>
	</div>

	<h3><code>callAI</code></h3>
	<p>
		If you want to use the AI Assistant extension, you must provide this callback to communicate
		with your AI backend route (like an OpenAI streaming endpoint). Edra handles the UI and the
		streaming chunk injection into the document, but you must provide the network request logic.
	</p>

	<hr class="my-6" />

	<h2>Example Configuration</h2>
	<div class="my-4">
		<Code code={initExample} language="ts" />
	</div>

	<div class="mt-12 flex justify-between">
		<Button href="/docs/installation" variant="outline" class="gap-2">
			<ArrowLeft />
			Installation
		</Button>
		<Button href="/docs/usages" class="gap-2">
			Usages
			<ArrowRight />
		</Button>
	</div>
</article>
