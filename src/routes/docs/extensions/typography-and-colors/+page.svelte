<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowRight, ArrowLeft } from '@lucide/svelte';
	import Code from '$lib/components/custom/docs/Code.svelte';

	const typographyCode = `import { Color, FontSize, TextStyle } from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';

// Configuration in extensions.ts
TextStyle,
FontSize,
Color,
Highlight.configure({ multicolor: true }),
TextAlign.configure({
	types: ['heading', 'paragraph']
})`;

	const commandsCode = `// Set Text Color
editor.chain().focus().setColor('#ef4444').run();

// Set Font Size
editor.chain().focus().setFontSize('18px').run();

// Align Text
editor.chain().focus().setTextAlign('center').run();`;
</script>

<svelte:head>
	<title>Typography & Colors | Edra Docs</title>
</svelte:head>

<article class="prose dark:prose-invert max-w-none">
	<h1>Typography & Colors</h1>
	<p class="lead">
		Take complete control of font styling, sizes, text alignment, highlights, and custom colors.
	</p>

	<hr class="my-6" />

	<h2>Configuration</h2>
	<p>
		Typography controls are powered by TipTap's standard styling and typography packages. The font
		sizes, colors, subscripts, and superscripts are integrated directly:
	</p>

	<div class="my-4">
		<Code code={typographyCode} language="typescript" />
	</div>

	<h2>Common Formatting Commands</h2>
	<p>Apply font attributes and alignments to selected text programmatically via:</p>

	<div class="my-4">
		<Code code={commandsCode} language="typescript" />
	</div>

	<h2>Included Extensions</h2>
	<ul class="mt-4 list-disc space-y-2 pl-6">
		<li>
			<strong>Text Align:</strong> Allows aligning paragraphs and headings to <code>left</code>,
			<code>center</code>, <code>right</code>, or <code>justify</code>.
		</li>
		<li>
			<strong>Highlighter:</strong> Supports highlighting text with multiple custom background colors.
		</li>
		<li>
			<strong>Subscript & Superscript:</strong> Subscript (<code>sub</code>) and Superscript (<code
				>sup</code
			>) marks for chemical formulas, math exponents, or footnote citations.
		</li>
		<li>
			<strong>Typography Extension:</strong> Automatically replaces characters with typography
			equivalents (e.g. converting <code>--</code> to <code>—</code> or <code>-></code> to
			<code>→</code>).
		</li>
	</ul>

	<div class="mt-12 flex justify-between">
		<Button href="/docs/extensions/tasks" variant="outline" class="gap-2">
			<ArrowLeft class="size-4" />
			Back to Task List
		</Button>
		<Button href="/docs/extensions/mathematics" class="gap-2">
			Mathematics Extension
			<ArrowRight class="size-4" />
		</Button>
	</div>
</article>
