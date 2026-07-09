<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowRight, ArrowLeft } from '@lucide/svelte';
	import Code from '$lib/components/custom/docs/Code.svelte';
	import { usageCode, cliShadcn, cliEdraHeadless, cliEdraShadcn } from './code.ts';
</script>

<svelte:head>
	<title>Installation | Edra Docs</title>
</svelte:head>

<article class="prose dark:prose-invert max-w-none">
	<h1>Installation</h1>
	<p class="lead">How to set up Edra and its required dependencies in your Svelte 5 application.</p>

	<hr class="my-6" />

	<h2>Option 1: Initialize using Edra CLI (Recommended)</h2>
	<p>
		The Edra CLI automatically copies the editor logic into your project folder and installs all necessary peer dependencies (TipTap core, extensions, and math plugins).
	</p>

	<h3>Headless Flavor</h3>
	<p>For an unstyled logical core editor that you can build on:</p>
	<div class="my-4">
		<Code code={cliEdraHeadless} language="shell" />
	</div>

	<h3>Shadcn UI Flavor</h3>
	<p>To initialize with a pre-configured shadcn-svelte toolbar and components layout:</p>
	<div class="my-4">
		<Code code={cliEdraShadcn} language="shell" />
	</div>

	<h2>Option 2: Install via shadcn-svelte CLI</h2>
	<p>
		If you are already using <code>shadcn-svelte</code>, you can add the styled Edra editor directly from our remote registry:
	</p>
	<div class="my-4">
		<Code code={cliShadcn} language="shell" />
	</div>

	<h2>Step 3: Basic Setup</h2>
	<p>
		Once initialized or added, import <code>createEditor</code> and the <code>Edra</code> markup wrapper inside your page to render the editor:
	</p>
	<div class="my-4">
		<Code code={usageCode} language="svelte" />
	</div>

	<div class="mt-12 flex justify-between">
		<Button href="/docs" variant="outline" class="gap-2">
			<ArrowLeft class="size-4" />
			Back to Intro
		</Button>
		<Button href="/docs/extensions/starter-kit" class="gap-2">
			Starter Kit Extensions
			<ArrowRight class="size-4" />
		</Button>
	</div>
</article>
