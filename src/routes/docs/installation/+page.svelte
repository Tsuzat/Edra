<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowRight, ArrowLeft } from '@lucide/svelte';
	import Code from '$lib/components/custom/docs/Code.svelte';
	import { usageCode } from './code.ts';

	const installCmd = `npm install @tiptap/core @tiptap/pm @tiptap/starter-kit @tiptap/extensions`;
</script>

<svelte:head>
	<title>Installation | Edra Docs</title>
</svelte:head>

<article class="prose dark:prose-invert max-w-none">
	<h1>Installation</h1>
	<p class="lead">How to set up Edra and its required dependencies in your Svelte 5 application.</p>

	<hr class="my-6" />

	<h2>Step 1: Install Peer Dependencies</h2>
	<p>
		Edra runs on top of TipTap. You'll need to install the core TipTap libraries and any specific
		extensions you want to use. Run the following command in your terminal:
	</p>

	<div class="my-4">
		<Code code={installCmd} language="shell" />
	</div>

	<h2>Step 2: Add Edra to Your Project</h2>
	<p>
		Edra components are copy-pasteable. Copy the <code>src/lib/edra</code> directory from the
		repository directly into your project's <code>src/lib/</code> directory.
	</p>

	<h2>Step 3: Basic Setup</h2>
	<p>
		Import <code>createEditor</code> and the <code>Edra</code> markup wrapper in your Svelte page to render
		a fully styled editor:
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
