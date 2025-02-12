# ShadEditor - A Rich Text Editor for Svelte with ShadCN UI

<img src="https://waka-api.dev-tsuzat.workers.dev/ShadEditor" />

A ready to use text editor build for svelte with tiptap and shadcn ui.

Creating a tiptap editor from scratch is a pain. This package provides a ready-to-use editor with all the features you need. You can install the package in your project but it will not give you flexibility. The recommended way is to use cli which installs all the dependencies for you and pastes the shadeditor component in your project.

## Table of Contents

- [ShadEditor - A Rich Text Editor for Svelte with ShadCN UI](#shadeditor---a-rich-text-editor-for-svelte-with-shadcn-ui)
	- [Table of Contents](#table-of-contents)
	- [Features](#features)
	- [Pre-Requisites (Important)](#pre-requisites-important)
			- [Adding shadcn and it's components](#adding-shadcn-and-its-components)
			- [Adding Tailwind Typography](#adding-tailwind-typography)
			- [Adding Lucide Icons (Optional, CLI will do it for you)](#adding-lucide-icons-optional-cli-will-do-it-for-you)
			- [Adding Mode Watcher (Optional, CLI will do it for you)](#adding-mode-watcher-optional-cli-will-do-it-for-you)
	- [Installation](#installation)
	- [Usage](#usage)
	- [Credits](#credits)
	- [License](#license)
	- [Support My Work](#support-my-work)

## Features

- **Rich Text** Editing with markdown shortcuts
- **Rich text** formatting like bold, italic, underline, strikethrough, superscript, subscript, textcolor, highlight, quickcolor, etc.
- **Highlighter** and **Text Color** Picker (Pick any color from the color visualizer)
- **Quickcolor** (Quickly pick a color from the color visualizer)
- **Table** (Create tables with ease and add, delete, merge, split rows, cells and columns)
- **Images** (Add images with url or pick from your device) with features like resize, align and caption
- **Videos** (Add videos with url or pick from your device) with features like resize, align and caption
- **Code Block** (Syntax highlight with lowlight) which supports multiple languages, dark and light mode and copy button
- **Blockquotes** (Add blockquotes with ease)
- **Tiptap Typography** (with emojis, color visualizer and special characters)
- **Links** (Add and remove links with ease)
- **Lists** (Unordered, ordered, task list)
- **Search and Replace** (Find and replace text in the editor)
- **Drag and Drop** (Drag and drop nodes in the editor with auto joiner feature)
- **Slash Command** (Add headings, tables, images, videos, code blocks etc with ease)
- **Font Size** (Change the font size of the text)

## Pre-Requisites (Important)

Since, this project uses shadcn ui, you need to install [shadcn](https://www.shadcn-svelte.com/) in your svelte project. The editor uses [tailwind typography](https://github.com/tailwindlabs/tailwindcss-typography) plugin which is not included in shadcn. So, you need to install it manually.

#### Adding shadcn and it's components

For installation of shadcn, please follow thier official [installation guide.](https://next.shadcn-svelte.com/docs/installation)

The editor usages tooltip, dropdown menu, button, separator, input, etc. Add them in your svelte project.

```bash
# using npm
npx shadcn-svelte@next add dropdown-menu button tooltip input popover separator
# using pnpm
pnpm dlx shadcn-svelte@next add dropdown-menu button tooltip input popover separator
```

#### Adding Tailwind Typography

For installation of tailwind typography, please follow thier official [installation guide.](https://github.com/tailwindlabs/tailwindcss-typography?tab=readme-ov-file#installation)

#### Adding Lucide Icons (Optional, CLI will do it for you)

Add lucide icons in your svelte project.

```bash
# using npm
npm install lucide-svelte
# using pnpm
pnpm install lucide-svelte
```

#### Adding Mode Watcher (Optional, CLI will do it for you)

Mode watcher is used to detect the mode of the editor. Add it in your svelte project.

```bash
# using npm
npm install mode-watcher
# using pnpm
pnpm install mode-watcher
```

## Installation

Recommended way is to use cli which installs all the dependencies for you and pastes the shadeditor component in your project. This method gives you full independence and flexibility. You can further customize the editor as per your need.

```bash
# using npm
npx shadeditor init
# using pnpm
pnpm dlx shadeditor init
```

## Usage

```svelte
<script lang="ts">
	import { browser } from '$app/environment';
	import ShadEditor from '$lib/components/shad-editor/shad-editor.svelte';
	import { writable } from 'svelte/store';

	let localStorageContent = '';

	if (browser) {
		localStorageContent = localStorage.getItem('content') || '';
	}

	const content = writable(localStorageContent);

	content.subscribe((value) => {
		console.log('Content Changed');
		if (!browser) return;
		localStorage.setItem('content', value);
	});
</script>

<main class="my-10 flex h-full w-full flex-col items-center justify-center">
	<ShadEditor class="h-[40rem]" content={$content} />
</main>
```

## Credits

This project had many inspirations and was built with the help of the following projects.

- [tiptap](https://tiptap.dev/) - A rich text editor framework
- [shadcn ui](https://next.shadcn-svelte.com/) - A ui component library
- [Shadcn Tiptap](https://tiptap.niazmorshed.dev/) - A tiptap implementation for react

## License

[MIT](LICENSE)

## Support My Work
<a href="https://www.buymeacoffee.com/tsuzat" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
