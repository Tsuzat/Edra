<script lang="ts">
	import { browser } from '$app/environment';
	import type { Content, Editor } from '@tiptap/core';
	import type { Transaction } from '@tiptap/pm/state';
	import { cn } from '$lib/utils.js';
	import GridPattern from '$lib/components/custom/grid-pattern.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Document from 'lucide-svelte/icons/file-text';
	import GitHub from 'lucide-svelte/icons/github';
	import { Edra, EdraToolbar, EdraBubbleMenu } from '$lib/edra/shadcn/index.js';
	import { slide } from 'svelte/transition';
	import defaultContent from '$lib/default_content.js';
	import DemoEditorSettings from '$lib/components/custom/demo-editor-settings.svelte';
	import EditorOutput from '$lib/components/custom/editor-output.svelte';

	let content = $state<Content>();
	let editor = $state<Editor>();

	$effect(() => {
		console.log('Content', content);
		localStorage.setItem('edra-content', JSON.stringify(content));
	});

	let showToolBar = $state(true);
	let showBubbleMenus = $state(true);
	let editable = $state(true);

	$effect(() => {
		console.log('editable', editable);
		editor?.setEditable(editable);
	});

	if (browser) {
		const rawDataString = localStorage.getItem('edra-content');

		if (rawDataString === null) {
			content = defaultContent;
		} else {
			const rawData: Content = JSON.parse(rawDataString);
			content = rawData;
		}
	}

	function onUpdate(props: { editor: Editor; transaction: Transaction }) {
		content = props.editor.getJSON();
	}
</script>

<div>
	<div class="animated-load relative flex size-full flex-col items-center justify-center *:my-4">
		<GridPattern
			width={30}
			height={30}
			strokeDashArray="4 2"
			class={cn(
				'absolute -top-4 -z-10 h-80 w-full [mask-image:radial-gradient(400px_circle_at_center,white,transparent)]'
			)}
		/>
		<h1 class="animate-pulse text-center text-4xl font-extrabold">Edra</h1>
		<span class="animate-bounce text-center text-muted-foreground">
			Best Rich Text Editor, made for <strong class="text-foreground"> Svelte Developers </strong>
			with
			<strong class="text-foreground"> Tiptap </strong>
		</span>
		<span class="w-full text-center text-muted-foreground sm:w-[35rem]">
			A Rich Text Editor made with Tiptap for Svelte Developers with extensibility and proper data
			output. Focused on ease of use and copied to your project as an component, with beautiful
			default UI
		</span>
		<div class="flex items-center justify-center gap-4">
			<Button variant="default" href="/docs">
				<Document /> View Docs
			</Button>
			<Button variant="secondary" href="https://github.com/Tsuzat/Edra" target="_blank">
				<GitHub /> Star on Github
			</Button>
		</div>
		<div class="size-full *:my-2">
			<div class="text-center text-xl font-bold">Explore Demo</div>
			<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
				<DemoEditorSettings bind:showToolBar bind:showBubbleMenus bind:editable />
				<EditorOutput code={JSON.stringify(content, null, 2)} />
			</div>
		</div>
	</div>
	<div class="m-auto flex h-[35rem] w-[95%] flex-col rounded border sm:w-[85%]">
		{#if editor}
			{#if showToolBar}
				<div transition:slide>
					<EdraToolbar {editor} />
				</div>
			{/if}
			<EdraBubbleMenu {editor} />
		{/if}
		<Edra class="overflow-auto" bind:editor {editable} {showBubbleMenus} {content} {onUpdate} />
	</div>
</div>

<style>
	:global(.edra-toolbar) {
		width: 100%;
		padding: 0.25rem;
	}

	.animated-load {
		opacity: 0;
		transform: translateY(-2rem);
		filter: blur(16px);
		animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		will-change: opacity, transform, filter;
		position: relative;
		overflow: hidden;
	}

	@keyframes fadeInUp {
		0% {
			opacity: 0;
			transform: translateY(-2rem);
			filter: blur(16px);
		}

		60% {
			opacity: 0.8;
			transform: translateY(0.2rem);
			filter: blur(8px);
		}

		100% {
			opacity: 1;
			transform: translateY(0);
			filter: blur(0);
		}
	}
</style>
