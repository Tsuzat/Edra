<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowLeft } from '@lucide/svelte';
	import Code from '$lib/components/custom/docs/Code.svelte';

	const extensionFile = `// src/lib/edra/extensions.ts
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';

export default [
	StarterKit.configure({
		heading: { levels: [1, 2, 3] }
	}),
	Highlight.configure({ multicolor: true })
	// Add your new TipTap extensions here!
];`;

	const rendererRegister = `// src/lib/edra/shadcn/editor.ts
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import CodeBlock from './components/CodeBlock.svelte';
import { SvelteNodeViewRenderer } from '../tiptap/index.ts';

export const createEditor = (props) =>
	useEditor({
		extensions: [
			...extensions,
			CodeBlockLowlight.configure({ lowlight }).extend({
				addNodeView() {
					return SvelteNodeViewRenderer(CodeBlock); // Bind custom Svelte component
				}
			})
		]
	});`;
</script>

<svelte:head>
	<title>Customizing Extensions | Edra Docs</title>
</svelte:head>

<article class="prose dark:prose-invert max-w-none">
	<h1>Customizing Extensions</h1>
	<p class="lead">
		Learn how to modify, add, or configure TipTap extensions and custom Svelte node view components.
	</p>

	<hr class="my-6" />

	<h2>1. Modifying Default Extensions</h2>
	<p>
		Edra pre-configures standard editing tools globally. To add your own custom TipTap extensions, configure settings, or remove default plugins, edit the following file:
	</p>
	<p>
		👉 <strong>File to modify:</strong> <code>src/lib/edra/extensions.ts</code>
	</p>
	<div class="my-4">
		<Code code={extensionFile} language="typescript" />
	</div>

	<h2>2. Custom Svelte Component Views (Node Views)</h2>
	<p>
		For complex elements (like Callout, Codeblock, Iframe, or Mermaid), Edra uses Svelte to render and interact with the node view. You can customize the styling and layout of these components:
	</p>

	<h3>Shadcn UI Flavor</h3>
	<p>
		👉 <strong>File mapping:</strong> <code>src/lib/edra/shadcn/editor.ts</code>
	</p>
	<p>
		👉 <strong>Components folder:</strong> <code>src/lib/edra/shadcn/components/*</code>
	</p>
	<div class="my-4">
		<Code code={rendererRegister} language="typescript" />
	</div>

	<h3>Headless UI Flavor</h3>
	<p>
		👉 <strong>File mapping:</strong> <code>src/lib/edra/headless/editor.ts</code>
	</p>
	<p>
		👉 <strong>Components folder:</strong> <code>src/lib/edra/headless/components/*</code>
	</p>

	<h2>3. Customizing the Toolbar</h2>
	<p>
		If you are using the Shadcn UI flavor and want to change, rearrange, or remove buttons on the main toolbar, modify:
	</p>
	<p>
		👉 <strong>File to modify:</strong> <code>src/lib/edra/shadcn/components/Toolbar.svelte</code>
	</p>

	<div class="mt-12 flex">
		<Button href="/docs/extensions/slash-command" variant="outline" class="gap-2">
			<ArrowLeft class="size-4" />
			Back to Slash Command
		</Button>
	</div>
</article>
