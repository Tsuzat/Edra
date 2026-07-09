<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowRight } from '@lucide/svelte';
</script>

<svelte:head>
	<title>Introduction | Edra Docs</title>
</svelte:head>

<article class="prose dark:prose-invert max-w-none">
	<h1>Introduction</h1>
	<p class="lead">
		Edra is a thoughtfully designed, premium rich text editor built for Svelte 5 and styled with
		shadcn-svelte.
	</p>

	<hr class="my-6" />

	<h2>Why Edra?</h2>
	<p>
		Building rich text editors is notoriously difficult. Edra bridges the gap by wrapping <strong>TipTap</strong> (a headless, highly-extensible editor framework) with a polished, developer-friendly interface that aligns perfectly with the Svelte ecosystem.
	</p>

	<h2>Flavors & UI Types</h2>
	<p>
		Edra provides two variants to match your workflow requirements:
	</p>
	<ul class="list-disc pl-6 space-y-2 mt-4">
		<li>
			<strong>Shadcn UI Type:</strong> Pre-styled using standard shadcn-svelte components and Tailwind v4. Fully customizable and fits right into your design system.
		</li>
		<li>
			<strong>Headless UI Type:</strong> Provides the core rich text editor logic and extensions without UI templates or predefined styling layout structures.
		</li>
	</ul>

	<h2>Key Features</h2>
	<ul class="list-disc pl-6 space-y-2 mt-4">
		<li>
			<strong>Extensible by Default:</strong> Easily add, customize, or swap TipTap extensions to meet
			your editor requirements.
		</li>
		<li>
			<strong>Svelte 5 Runes:</strong> Built on Svelte 5 with reactivity driven by runes, providing incredible
			performance and simple reactivity patterns.
		</li>
		<li>
			<strong>Shadcn UI & Tailwind CSS v4:</strong> Fully integrated with modern styling constructs, variables,
			and dark-mode watchers.
		</li>
		<li>
			<strong>AI-Assisted (Optional):</strong> Native hooks to integrate custom AI providers for inline
			streaming autocompletion and prompts.
		</li>
		<li>
			<strong>Pre-configured Powerhouses:</strong> Out-of-the-box support for LaTeX formulas (KaTeX),
			task lists, drag handles, tables, and typography controls.
		</li>
	</ul>

	<h2>How to read the docs</h2>
	<p>
		If you are new to Edra, we recommend starting with the <strong>Installation</strong> guide. If
		you are looking to customize your editor, check out the various
		<strong>Extensions & Plugins</strong> documented in the sidebar.
	</p>

	<div class="mt-12 flex justify-end">
		<Button href="/docs/installation" class="gap-2">
			Go to Installation
			<ArrowRight class="size-4" />
		</Button>
	</div>
</article>
