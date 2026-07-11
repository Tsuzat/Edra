<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowLeft } from '@lucide/svelte';
	import Code from '$lib/components/custom/docs/Code.svelte';

	const staticExample = `// src/lib/edra/strings.ts
export default {
	command: {
		undo: 'Deshacer',
		redo: 'Rehacer',
		h1: 'Encabezado 1',
		// ...
	},
	// ...
};`;

	const i18nExample = `// src/lib/edra/strings.ts
import { m } from '$lib/i18n/messages.js'; // Example using paraglide-js

// You can replace static strings with reactive functions or getters
// depending on your i18n library.
export default {
	command: {
		get undo() { return m.undo() },
		get redo() { return m.redo() },
		get h1() { return m.h1() },
	},
	// ...
};`;
</script>

<svelte:head>
	<title>Localization & Strings | Edra Docs</title>
</svelte:head>

<article class="prose dark:prose-invert max-w-none">
	<h1>Localization & Multi-Language</h1>
	<p class="lead">
		Edra centralizes all text, placeholders, and UI labels into a single configuration file, making
		it incredibly easy to translate or connect to your existing i18n solution.
	</p>

	<hr class="my-6" />

	<h2>The strings.ts file</h2>
	<p>
		When you install Edra via the registry, a file named <code>src/lib/edra/strings.ts</code> is added
		to your project. This file contains a plain JavaScript object mapping all the text used throughout
		the editor's UI—including slash commands, tooltips, placeholders, and error messages.
	</p>

	<h3>Static Translation</h3>
	<p>
		If your application only needs to support one specific language (e.g., Spanish or French), you
		can directly edit this file and translate the strings manually.
	</p>
	<div class="my-4">
		<Code code={staticExample} language="ts" />
	</div>

	<hr class="my-6" />

	<h2>Integrating with i18n Libraries</h2>
	<p>
		If you are building a multi-language application using tools like <code
			>inlang/paraglide-js</code
		>, <code>svelte-i18n</code>, or <code>typesafe-i18n</code>, you can easily wire them up to Edra.
	</p>
	<p>
		Since Svelte 5 and many modern i18n tools support reactive functions or stores, you can use
		JavaScript getters to dynamically return the translated strings. This ensures that when the user
		switches their language, the editor's UI updates reactively.
	</p>
	<div class="my-4">
		<Code code={i18nExample} language="ts" />
	</div>

	<div class="mt-12 flex">
		<Button href="/docs/customization" variant="outline" class="gap-2">
			<ArrowLeft class="size-4" />
			Back to Customization
		</Button>
	</div>
</article>
