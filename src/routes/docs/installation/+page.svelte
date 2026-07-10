<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowRight, ArrowLeft } from '@lucide/svelte';
	import Code from '$lib/components/custom/docs/Code.svelte';
	import CliCode from '$lib/components/custom/docs/CliCode.svelte';
	import { usageCode } from './code.ts';
</script>

<svelte:head>
	<title>Installation | Edra Docs</title>
</svelte:head>

<article class="prose dark:prose-invert max-w-none">
	<h1>Installation</h1>
	<p class="lead">How to set up Edra and its required dependencies in your Svelte 5 application.</p>

	<h2>Shadcn UI Type</h2>
	<p>
		For a pre-configured editor integrated with shadcn-svelte toolbar and components layout. Use the <code
			>shadcn-svelte</code
		> CLI to pull it directly from the remote registry, allowing clean updates over time:
	</p>
	<div class="my-4">
		<CliCode type="registry" />
	</div>
	<p>
		Alternatively, initialize the editor via the Edra CLI (this copies the editor logic into your
		project):
	</p>
	<div class="my-4">
		<CliCode type="shadcn" />
	</div>

	<h2>Headless UI Type</h2>
	<p>
		For an unstyled logical core editor that you can build on. Initialize it via the Edra CLI, which
		automatically copies the editor logic into your project and installs TipTap core packages:
	</p>
	<div class="my-4">
		<CliCode type="headless" />
	</div>

	<h2>Basic Setup</h2>
	<p>
		Once initialized or added, import <code>createEditor</code> and the <code>Edra</code> markup wrapper
		inside your page to render the editor:
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
