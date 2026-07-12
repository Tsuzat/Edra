<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowRight, ArrowLeft } from '@lucide/svelte';
	import CliCode from '$lib/components/custom/docs/CliCode.svelte';
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Templates | Edra Docs</title>
</svelte:head>

<article class="prose dark:prose-invert max-w-none">
	<h1>Templates</h1>
	<p class="lead">Pre-built workspace templates to get you started faster.</p>

	<p>
		Edra provides a couple of full-page templates that you can install directly into your project.
		These templates are installed using the shadcn-svelte CLI and will be placed in your components
		directory under <code>edra/templates</code>.
	</p>

	<hr class="my-6" />

	<div class="callout my-6 rounded-md border-l-4 border-l-blue-500 bg-blue-500/10 p-4">
		<p class="m-0 font-medium text-blue-700 dark:text-blue-400">Already installed Edra?</p>
		<p class="m-0 mt-2 text-sm">
			If you have already installed the core Edra editor, you don't need to use the CLI. You can
			simply copy the code examples below and paste them into your Svelte pages to get the desired
			result instantly.
		</p>
	</div>

	<h2>AI Editor Template</h2>
	<p>
		A clean, focused writing environment with a built-in AI toolbar and word counter, similar to
		modern AI-assisted writing tools.
	</p>

	<div class="my-4">
		<CliCode type="template-ai" />
	</div>

	<Button variant="link" href={resolve('/templates/ai')} target="_blank"
		>View AI Template Demo</Button
	>

	<hr class="my-6" />

	<h2>Notion-Like Template</h2>
	<p>
		A full workspace template featuring cover images, standard/full width toggles, and Notion-style
		headings.
	</p>

	<div class="my-4">
		<CliCode type="template-notion" />
	</div>

	<Button variant="link" href={resolve('/templates/notion')} target="_blank"
		>View Notion Template Demo</Button
	>

	<div class="mt-12 flex justify-between">
		<Button href={resolve('/docs/configuration')} variant="outline" class="gap-2">
			<ArrowLeft />
			Configuration
		</Button>
		<Button href={resolve('/docs/usages')} class="gap-2">
			Usages
			<ArrowRight />
		</Button>
	</div>
</article>
