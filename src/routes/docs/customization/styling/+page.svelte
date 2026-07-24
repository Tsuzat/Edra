<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowLeft } from '@lucide/svelte';
	import Code from '$lib/components/custom/docs/Code.svelte';

	const globalStyleExample = `/* src/routes/layout.css (Global Svelte Stylesheet) */
h1 {
	@apply text-4xl font-extrabold tracking-tight lg:text-5xl;
}
p {
	@apply leading-7 mt-6;
}
a {
	@apply font-medium text-primary underline underline-offset-4;
}`;

	const customCSSExample = `/* src/lib/edra/shadcn/editor.css */
.tiptap {
	max-width: 48rem;
	margin-inline: auto;
}

.tiptap p {
	line-height: 1.8;
	margin-bottom: 1.25rem;
}

.tiptap h1 {
	font-family: 'Playfair Display', serif;
	font-size: 3rem;
	font-weight: 900;
	color: hsl(var(--primary));
}`;

	const overrideTokensExample = `/* Overriding headless CSS variables (src/lib/edra/headless/editor.css) */
:root {
	--edra-font-sans: 'Cabinet Grotesk', 'Inter', sans-serif;
	--edra-font-mono: 'Input Mono', monospace;
	--edra-radius-lg: 8px;
	--edra-ink: #1f2937;
	--edra-canvas: #f9fafb;
}

.dark {
	--edra-ink: #f3f4f6;
	--edra-canvas: #111827;
}`;
</script>

<svelte:head>
	<title>Typography & Styling | Edra Docs</title>
</svelte:head>

<article class="prose dark:prose-invert max-w-none">
	<h1>Typography & Styling</h1>
	<p class="lead">
		A guide to the styling architecture of Edra, explaining how the editor inherits, scopes, and
		structures typography, layout, and colors.
	</p>

	<hr class="my-6" />

	<h2>1. The Global Inheritance Model</h2>
	<p>
		Unlike other editors that sandbox their document canvas inside an iframe or isolate it under a
		shadow root, Edra renders standard semantic HTML directly inside Svelte's DOM.
	</p>
	<p>
		As a result, Edra naturally **inherits** all global tag styles configured in your app's global
		stylesheets, such as:
	</p>
	<ul>
		<li>Font families, weights, and sizes.</li>
		<li>Line heights and letter spacing.</li>
		<li>Link colors, transitions, and underline details.</li>
	</ul>
	<p>
		For example, in the documentation page layout, the styles for <code>h1</code>, <code>p</code>,
		and <code>a</code> are configured globally:
	</p>
	<div class="my-4">
		<Code code={globalStyleExample} language="css" />
	</div>

	<hr class="my-6" />

	<h2>2. Scoping Styles with Tiptap (.tiptap)</h2>
	<p>
		While global styles provide the baseline, TipTap wraps the entire editable document inside a
		container element with the class <code>.tiptap</code>.
	</p>
	<p>
		All editor-specific margins, layout rules, placeholders, and node alignments are targeted under
		the <code>.tiptap</code> scope to ensure they only affect content inside the editor and do not leak
		into the rest of the application.
	</p>

	<hr class="my-6" />

	<h2>3. Customizing the Shadcn UI Flavor</h2>
	<p>
		The Shadcn UI flavor is built with Tailwind CSS and uses standard tailwind theme variables (like <code
			>hsl(var(--primary))</code
		>
		or <code>var(--color-border)</code>).
	</p>
	<p>
		👉 <strong>File to modify:</strong> <code>src/lib/edra/shadcn/editor.css</code>
	</p>
	<p>
		Since it binds to Tailwind's theme variables, it naturally matches your light/dark mode switcher
		and custom colors automatically. You can edit this file to customize:
	</p>
	<ul>
		<li>
			<strong>Content Width:</strong> Modify <code>.tiptap {'{ max-width: ... }'}</code> to set the editor
			margin-inline layout.
		</li>
		<li>
			<strong>Node views:</strong> Customize elements like codeblocks, images, callouts, and table cells.
		</li>
	</ul>
	<div class="my-4">
		<Code code={customCSSExample} language="css" />
	</div>

	<hr class="my-6" />

	<h2>4. Customizing the Headless UI Flavor</h2>
	<p>
		The Headless UI flavor is designed to be completely standalone and framework-agnostic. It does
		not depend on Tailwind CSS variables. Instead, it utilizes its own custom token variables
		prefixed with <code>--edra-*</code>.
	</p>
	<p>
		👉 <strong>File to modify:</strong> <code>src/lib/edra/headless/editor.css</code>
	</p>
	<p>
		You can fully customize the look and feel of the Headless UI editor by modifying the tokens in
		the stylesheet.
	</p>

	<div class="my-6 overflow-x-auto rounded-lg border text-foreground">
		<table class="m-0! min-w-full divide-y divide-border">
			<thead class="bg-muted/50">
				<tr class="border-b border-border">
					<th
						class="border-0! px-4 py-3 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase"
						>Token</th
					>
					<th
						class="border-0! px-4 py-3 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase"
						>Description</th
					>
					<th
						class="border-0! px-4 py-3 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase"
						>Default Light Value</th
					>
					<th
						class="border-0! px-4 py-3 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase"
						>Default Dark Value</th
					>
				</tr>
			</thead>
			<tbody class="divide-y divide-border">
				<tr class="transition-colors hover:bg-muted/30">
					<td class="border-0! px-4 py-3 font-mono text-sm font-medium"
						><code class="rounded bg-muted px-1.5 py-0.5 text-xs">--edra-ink</code></td
					>
					<td class="border-0! px-4 py-3 text-sm text-muted-foreground">Primary text color</td>
					<td class="border-0! px-4 py-3 font-mono text-sm text-muted-foreground"
						><code class="rounded bg-muted px-1.5 py-0.5 text-xs">#171717</code></td
					>
					<td class="border-0! px-4 py-3 font-mono text-sm text-muted-foreground"
						><code class="rounded bg-muted px-1.5 py-0.5 text-xs">#f5f5f5</code></td
					>
				</tr>
				<tr class="transition-colors hover:bg-muted/30">
					<td class="border-0! px-4 py-3 font-mono text-sm font-medium"
						><code class="rounded bg-muted px-1.5 py-0.5 text-xs">--edra-body</code></td
					>
					<td class="border-0! px-4 py-3 text-sm text-muted-foreground"
						>Secondary/body text color</td
					>
					<td class="border-0! px-4 py-3 font-mono text-sm text-muted-foreground"
						><code class="rounded bg-muted px-1.5 py-0.5 text-xs">#4d4d4d</code></td
					>
					<td class="border-0! px-4 py-3 font-mono text-sm text-muted-foreground"
						><code class="rounded bg-muted px-1.5 py-0.5 text-xs">#a1a1a1</code></td
					>
				</tr>
				<tr class="transition-colors hover:bg-muted/30">
					<td class="border-0! px-4 py-3 font-mono text-sm font-medium"
						><code class="rounded bg-muted px-1.5 py-0.5 text-xs">--edra-mute</code></td
					>
					<td class="border-0! px-4 py-3 text-sm text-muted-foreground">Subtle/muted text</td>
					<td class="border-0! px-4 py-3 font-mono text-sm text-muted-foreground"
						><code class="rounded bg-muted px-1.5 py-0.5 text-xs">#888888</code></td
					>
					<td class="border-0! px-4 py-3 font-mono text-sm text-muted-foreground"
						><code class="rounded bg-muted px-1.5 py-0.5 text-xs">#666666</code></td
					>
				</tr>
				<tr class="transition-colors hover:bg-muted/30">
					<td class="border-0! px-4 py-3 font-mono text-sm font-medium"
						><code class="rounded bg-muted px-1.5 py-0.5 text-xs">--edra-canvas</code></td
					>
					<td class="border-0! px-4 py-3 text-sm text-muted-foreground">Editor background</td>
					<td class="border-0! px-4 py-3 font-mono text-sm text-muted-foreground"
						><code class="rounded bg-muted px-1.5 py-0.5 text-xs">#ffffff</code></td
					>
					<td class="border-0! px-4 py-3 font-mono text-sm text-muted-foreground"
						><code class="rounded bg-muted px-1.5 py-0.5 text-xs">#0a0a0a</code></td
					>
				</tr>
				<tr class="transition-colors hover:bg-muted/30">
					<td class="border-0! px-4 py-3 font-mono text-sm font-medium"
						><code class="rounded bg-muted px-1.5 py-0.5 text-xs">--edra-canvas-soft</code></td
					>
					<td class="border-0! px-4 py-3 text-sm text-muted-foreground"
						>Floating panels background</td
					>
					<td class="border-0! px-4 py-3 font-mono text-sm text-muted-foreground"
						><code class="rounded bg-muted px-1.5 py-0.5 text-xs">#fafafa</code></td
					>
					<td class="border-0! px-4 py-3 font-mono text-sm text-muted-foreground"
						><code class="rounded bg-muted px-1.5 py-0.5 text-xs">#121212</code></td
					>
				</tr>
				<tr class="transition-colors hover:bg-muted/30">
					<td class="border-0! px-4 py-3 font-mono text-sm font-medium"
						><code class="rounded bg-muted px-1.5 py-0.5 text-xs">--edra-border</code></td
					>
					<td class="border-0! px-4 py-3 text-sm text-muted-foreground">Border/separator color</td>
					<td class="border-0! px-4 py-3 font-mono text-sm text-muted-foreground"
						><code class="rounded bg-muted px-1.5 py-0.5 text-xs">var(--edra-hairline)</code></td
					>
					<td class="border-0! px-4 py-3 font-mono text-sm text-muted-foreground"
						><code class="rounded bg-muted px-1.5 py-0.5 text-xs">var(--edra-hairline)</code></td
					>
				</tr>
				<tr class="transition-colors hover:bg-muted/30">
					<td class="border-0! px-4 py-3 font-mono text-sm font-medium"
						><code class="rounded bg-muted px-1.5 py-0.5 text-xs">--edra-font-sans</code></td
					>
					<td class="border-0! px-4 py-3 text-sm text-muted-foreground">Main font family</td>
					<td class="border-0! px-4 py-3 font-mono text-sm text-muted-foreground"
						><code class="rounded bg-muted px-1.5 py-0.5 text-xs">Geist, Inter, sans-serif</code
						></td
					>
					<td class="border-0! px-4 py-3 font-mono text-sm text-muted-foreground"
						><code class="rounded bg-muted px-1.5 py-0.5 text-xs">Geist, Inter, sans-serif</code
						></td
					>
				</tr>
				<tr class="transition-colors hover:bg-muted/30">
					<td class="border-0! px-4 py-3 font-mono text-sm font-medium"
						><code class="rounded bg-muted px-1.5 py-0.5 text-xs">--edra-font-mono</code></td
					>
					<td class="border-0! px-4 py-3 text-sm text-muted-foreground">Code/mono font family</td>
					<td class="border-0! px-4 py-3 font-mono text-sm text-muted-foreground"
						><code class="rounded bg-muted px-1.5 py-0.5 text-xs">Geist Mono, monospace</code></td
					>
					<td class="border-0! px-4 py-3 font-mono text-sm text-muted-foreground"
						><code class="rounded bg-muted px-1.5 py-0.5 text-xs">Geist Mono, monospace</code></td
					>
				</tr>
			</tbody>
		</table>
	</div>

	<p>To override these tokens for light and dark themes:</p>
	<div class="my-4">
		<Code code={overrideTokensExample} language="css" />
	</div>

	<div class="mt-12 flex">
		<Button href="/docs/customization" variant="outline" class="gap-2">
			<ArrowLeft class="size-4" />
			Back to Customization
		</Button>
	</div>
</article>
