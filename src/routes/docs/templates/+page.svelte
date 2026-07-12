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

	<h2>AI Editor Template</h2>
	<p>
		A clean, focused writing environment with a built-in AI toolbar and word counter, similar to
		modern AI-assisted writing tools.
	</p>

	<div class="my-4">
		<CliCode type="template-ai" />
	</div>

	<p>
		<a href={resolve('/templates/ai')} target="_blank">View AI Template Demo</a>
	</p>

	<hr class="my-6" />

	<h2>Notion-Like Template</h2>
	<p>
		A full workspace template featuring cover images, standard/full width toggles, and Notion-style
		headings.
	</p>

	<div class="my-4">
		<CliCode type="template-notion" />
	</div>

	<p>
		<a href={resolve('/templates/notion')} target="_blank">View Notion Template Demo</a>
	</p>

	<div class="mt-12 flex justify-between">
		<Button href={resolve('/docs/installation')} variant="outline" class="gap-2">
			<ArrowLeft class="size-4" />
			Installation
		</Button>
		<Button href={resolve('/docs/configuration')} class="gap-2">
			Configuration & API
			<ArrowRight class="size-4" />
		</Button>
	</div>
</article>
