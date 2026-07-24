<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowRight, ArrowLeft } from '@lucide/svelte';
	import Code from '$lib/components/custom/docs/Code.svelte';

	const configCode = `import Mathematics from '@tiptap/extension-mathematics';

Mathematics.configure({
	katexOptions: {
		throwOnError: false,
		macros: {
			'\\\\R': '\\\\mathbb{R}',
			'\\\\N': '\\\\mathbb{N}'
		}
	}
})`;

	const onMathClickCode = `import { createEditor } from '$lib/edra/headless';

const editor = createEditor({
	onMathClick: (node, pos, isBlock, editor) => {
		// Open your own math UI (e.g. MathLive) instead of the default prompt
		console.log(node.attrs.latex, { pos, isBlock });
	}
});`;

	const exampleEquation = `$$f(x) = \\int_{-\\infty}^{\\infty} \\hat{f}(\\xi) e^{2 \\pi i x \\xi} d\\xi$$`;
</script>

<svelte:head>
	<title>Mathematics | Edra Docs</title>
</svelte:head>

<article class="prose dark:prose-invert max-w-none">
	<h1>Mathematics (LaTeX / KaTeX)</h1>
	<p class="lead">
		Render publication-grade math formulas directly inside the editor using LaTeX syntax and KaTeX.
	</p>

	<hr class="my-6" />

	<h2>Configuration</h2>
	<p>
		The math extension uses <code>@tiptap/extension-mathematics</code> as a wrapper around the super
		fast <code>katex</code> renderer. Edra pre-configures standard options and macros (such as
		<code>\R</code>
		and <code>\N</code>) via shared <code>katexOptions</code> in <code>extensions.ts</code>, and
		wires Mathematics inside <code>createEditor</code> so hosts can pass <code>onMathClick</code>:
	</p>

	<div class="my-4">
		<Code code={configCode} language="typescript" />
	</div>

	<h2>Custom math click handler</h2>
	<p>
		Pass <code>onMathClick</code> to <code>createEditor</code> to handle clicks on math nodes
		(for example, open a custom equation editor). The callback receives the ProseMirror
		<code>node</code>, document <code>pos</code>, whether it is block math (<code>isBlock</code>),
		and the <code>editor</code> instance. This forwards TipTap Mathematics'
		<code>onClick</code> for both block and inline math.
	</p>

	<div class="my-4">
		<Code code={onMathClickCode} language="typescript" />
	</div>

	<h2>How to use in Editor</h2>
	<p>To write math equations, wrap your LaTeX string in dollar signs:</p>
	<ul class="mt-4 list-disc space-y-2 pl-6">
		<li>
			<strong>Inline Math:</strong> Wrap with single dollar signs (e.g.
			<code>$a^2 + b^2 = c^2$</code>). When you type the closing dollar sign, it compiles
			immediately.
		</li>
		<li>
			<strong>Block Math:</strong> Wrap with double dollar signs (e.g. <code>$$E = mc^2$$</code>) to
			render equations on a separate centered line.
		</li>
	</ul>

	<div class="my-4">
		<Code code={exampleEquation} language="latex" />
	</div>

	<h2>Styles</h2>
	<p>
		To output rendering properly, make sure KaTeX styles are imported. Edra takes care of standard
		layout alignments, rendering overlays, and mathematical symbols so that equations look correct
		in both light and dark modes.
	</p>

	<div class="mt-12 flex justify-between">
		<Button href="/docs/extensions/typography-and-colors" variant="outline" class="gap-2">
			<ArrowLeft class="size-4" />
			Back to Typography
		</Button>
		<Button href="/docs/extensions/markdown" class="gap-2">
			Markdown Extension
			<ArrowRight class="size-4" />
		</Button>
	</div>
</article>
