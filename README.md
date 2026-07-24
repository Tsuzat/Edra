<div align="center">
  <h1>Edra Editor</h1>
  <p><strong>A full-featured, block-styled rich text editor for Svelte 5</strong></p>

<a href="https://edra.tsuzat.com"><strong>Explore the Documentation »</strong></a>

  <br />
  <br />

  <!-- Badges -->
  <img src="https://img.shields.io/badge/Svelte-5.x-ff3e00.svg?logo=svelte&logoColor=white" alt="Svelte 5" />
  <img src="https://img.shields.io/badge/Tiptap-2.x-black.svg?logo=react&logoColor=white" alt="Tiptap" />
  <img src="https://img.shields.io/badge/shadcn--svelte-compatible-black.svg" alt="shadcn-svelte" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?logo=typescript&logoColor=white" alt="TypeScript" />
</div>

## ✨ Introduction

Edra is a modern, extensible rich text editor built on top of [Tiptap](https://tiptap.dev/) specifically for **Svelte 5** environments. It leverages the styling and components of [shadcn-svelte](https://shadcn-svelte.com/) to provide a beautiful, cohesive, and fully accessible writing experience right out of the box.

Whether you need a Notion-like block editor with drag-and-drop mechanics or a lightweight, headless core, Edra gives you full control over your content.

## 🚀 Key Features

- **Built for Svelte 5**: Leverages the power of runes and snippets for high performance and reactive state management.
- **Two Variants**: Choose between the opinionated, beautiful **Shadcn UI** flavor, or the unstyled **Headless** core to bring your own design system.
- **Block Mechanics**: Native support for drag-and-drop block handles, just like Notion.
- **Slash Commands**: Type `/` to instantly pull up a contextual menu to insert headings, media, tables, and more.
- **Rich Media & Embeds**: Seamlessly upload images, videos, and audio. Paste HTML directly into the editor to embed YouTube, Spotify, and more via our Iframe handler.
- **Advanced Extensions**: First-class support for Mathematics (KaTeX), Mermaid diagrams, Callouts, and syntax-highlighted Code Blocks.
- **Table of Contents**: Automatically extract hierarchical headings to render a scroll-spy side navigation.
- **AI Ready**: Hooks designed specifically for streaming AI completions directly into the editor canvas.

## 📦 Installation

Edra is distributed via the `shadcn-svelte` registry, meaning the source code is installed directly into your project. This gives you absolute control over the styling and dependencies.

```bash
npx shadcn-svelte@latest add https://edra.tsuzat.com/r/edra.json
```

For the unstyled Headless variant, or for more detailed installation options, refer to the [Installation Documentation](https://edra.tsuzat.com/docs/installation).

## 💻 Quick Start

Once installed, instantiating the editor is incredibly simple:

```svelte
<script lang="ts">
	import { createEditor, Edra } from '$lib/edra/shadcn/index.js';
	import { updateInDB } from '$lib/db';

	/**
	 * [OPTIONAL] Use this function so perform something when content is updated.
	 * May be save the content somewhere. You can define your own logic here.
	 */
	const onUpdate = () => {
		const content = editor?.getJSON();
		updateInDB(content);
	};

	/**
	 * [OPTIONAL] Pass an call AI function which takes a prompt, onChunk and onError callbacks
	 * This function allows you to implement your own AI provider
	 */
	async function callAI(
		prompt: string,
		onChunk: (chunk: string) => void,
		onError: (error: Error) => void
	) {}

	const editor = createEditor({
		onUpdate,
		callAI
	});
</script>

<div class="rounded-lg border">
	<Edra {editor}>
		<Edra.UseAI />
		<Edra.Toolbar class="max-w-full! scrollbar-none overflow-x-scroll border-b p-1" />
		<Edra.BubbleMenu />
		<Edra.Content class="h-150 cursor-auto overflow-y-scroll px-8 py-4 *:outline-none" />
		<Edra.DragHandle />
	</Edra>
</div>
```

## 📚 Documentation

The official documentation contains exhaustive guides on configuring the editor, extracting data (JSON/HTML/Markdown), customizing the UI, and connecting to i18n libraries.

👉 **[Read the full documentation here](https://edra.tsuzat.com/docs)**

## 📄 License

Released under the MIT License.
