<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowRight, ArrowLeft } from '@lucide/svelte';
	import Code from '$lib/components/custom/docs/Code.svelte';

	const configCode = `import StarterKit from '@tiptap/starter-kit';

StarterKit.configure({
	orderedList: {
		HTMLAttributes: {
			class: 'list-decimal'
		}
	},
	bulletList: {
		HTMLAttributes: {
			class: 'list-disc'
		}
	},
	heading: {
		levels: [1, 2, 3, 4]
	},
	link: {
		openOnClick: false,
		autolink: true,
		linkOnPaste: true,
		HTMLAttributes: {
			target: '_blank',
			rel: 'noopener noreferrer nofollow'
		}
	},
	codeBlock: false
})`;
</script>

<svelte:head>
	<title>Starter Kit | Edra Docs</title>
</svelte:head>

<article class="prose dark:prose-invert max-w-none">
	<h1>Starter Kit Extension</h1>
	<p class="lead">
		The core suite of editing tools providing headings, lists, links, and basic markdown commands.
	</p>

	<hr class="my-6" />

	<h2>Configuration</h2>
	<p>
		Edra pre-configures <code>StarterKit</code> to ensure standard layouts align with the typography system.
		Bullet lists and ordered lists are decorated with standard classes automatically.
	</p>

	<div class="my-4">
		<Code code={configCode} language="typescript" />
	</div>

	<h2>Included Features</h2>
	<ul class="list-disc pl-6 space-y-2 mt-4">
		<li><strong>Headings:</strong> Support for levels 1 to 4 with matching sizes.</li>
		<li>
			<strong>Lists:</strong> Decoreated bullet lists (<code>list-disc</code>) and numbered lists (<code
				>list-decimal</code
			>).
		</li>
		<li>
			<strong>Links:</strong> Automatically converts pasted URLs into links, opening in new tabs by default.
		</li>
		<li><strong>Basic Marks:</strong> Bold, Italic, Strike-through, and Code formatting.</li>
	</ul>

	<div class="mt-12 flex justify-between">
		<Button href="/docs/installation" variant="outline" class="gap-2">
			<ArrowLeft class="size-4" />
			Back to Installation
		</Button>
		<Button href="/docs/extensions/tables" class="gap-2">
			Tables Extension
			<ArrowRight class="size-4" />
		</Button>
	</div>
</article>
