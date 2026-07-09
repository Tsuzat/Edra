<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowRight, ArrowLeft } from '@lucide/svelte';
	import Code from '$lib/components/custom/docs/Code.svelte';

	const taskCode = `import { TaskList, TaskItem } from '@tiptap/extension-list';

// Task list & item extensions are loaded as follows:
// TaskList
// TaskItem.configure({ nested: true })

// Programmatic command to toggle task list:
editor.chain().focus().toggleTaskList().run();`;
</script>

<svelte:head>
	<title>Task List | Edra Docs</title>
</svelte:head>

<article class="prose dark:prose-invert max-w-none">
	<h1>Task List Extension</h1>
	<p class="lead">
		Build interactive checklists with nested task items that users can toggle directly from the
		editor view.
	</p>

	<hr class="my-6" />

	<h2>Usage</h2>
	<p>
		The task list is powered by <code>@tiptap/extension-list</code>. It allows creating list items
		with checkboxes that are fully interactive. Nested lists are supported out of the box, allowing
		hierarchical checklists.
	</p>

	<div class="my-4">
		<Code code={taskCode} language="typescript" />
	</div>

	<h2>Keyboard Shortcuts</h2>
	<p>Users can interact with task lists using these standard keys:</p>
	<ul class="list-disc pl-6 space-y-2 mt-4">
		<li><code>Enter</code>: Creates a new checklist item at the current level.</li>
		<li><code>Tab</code>: Indents the active item, nesting it under the item above.</li>
		<li><code>Shift + Tab</code>: Outdents the active item to bring it to a higher level.</li>
	</ul>

	<h2>Styling Checklist Items</h2>
	<p>
		Inside Edra, checkbox states, custom checkmarks, and line-through styles for completed items are
		defined globally in <code>editor.css</code>. Checkboxes are aligned cleanly with standard text
		fonts and support standard hover interactions.
	</p>

	<div class="mt-12 flex justify-between">
		<Button href="/docs/extensions/tables" variant="outline" class="gap-2">
			<ArrowLeft class="size-4" />
			Back to Tables
		</Button>
		<Button href="/docs/extensions/typography-and-colors" class="gap-2">
			Typography & Colors
			<ArrowRight class="size-4" />
		</Button>
	</div>
</article>
