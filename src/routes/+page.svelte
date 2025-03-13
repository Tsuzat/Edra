<script lang="ts">
	import { browser } from '$app/environment';
	import type { Content, Editor } from '@tiptap/core';
	import type { Transaction } from '@tiptap/pm/state';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { cn } from '$lib/utils.js';
	import GridPattern from '$lib/components/custom/grid-pattern.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import Document from 'lucide-svelte/icons/file-text';
	import GitHub from 'lucide-svelte/icons/github';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import FileJson from 'lucide-svelte/icons/file-json';
	import ShikiCode from '$lib/components/custom/shiki-code.svelte';
	import { toast } from 'svelte-sonner';
	import { Edra, EdraToolbar } from '$lib/edra/shad-edra/index.js';
	import { slide } from 'svelte/transition';

	let content = $state<Content>();
	let editor = $state<Editor>();

	let contentJSONString = $state('');

	let showToolBar = $state(true);
	let showMenu = $state(true);

	if (browser) {
		const rawData: Content = JSON.parse(localStorage.getItem('edra-content') ?? '{}');
		content = rawData;
		contentJSONString = JSON.stringify(rawData, null, 2);
	}

	function onUpdate(props: { editor: Editor; transaction: Transaction }) {
		localStorage.setItem('edra-content', JSON.stringify(props.editor.getJSON()));
		contentJSONString = JSON.stringify(props.editor.getJSON(), null, 2);
	}
</script>

<div class="animated-load relative flex flex-col items-center justify-center *:my-4">
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
		<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
			<div class="flex items-center gap-2">
				<Checkbox id="toolbar" bind:checked={showToolBar} />
				<Label for="toolbar" class="text-sm font-medium leading-none">Show Editor Toolbar</Label>
			</div>
			<div class="flex items-center gap-2">
				<Checkbox id="menus" bind:checked={showMenu} />
				<Label for="menus" class="text-sm font-medium leading-none">Show Editor Menus</Label>
			</div>
			<Dialog.Root>
				<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
					<FileJson /> Show Output
				</Dialog.Trigger>
				<Dialog.Content class="h-[95%] w-[95vw] sm:h-[80%] sm:min-w-[50%]">
					<Dialog.Header>
						<Dialog.Title>JSON Output</Dialog.Title>
						<Dialog.Description>Observe the JSON output of the editor content</Dialog.Description>
					</Dialog.Header>
					<ShikiCode class="size-full overflow-auto" code={contentJSONString} lang="json" />
					<Button
						variant="outline"
						class="ml-auto w-fit"
						onclick={() => {
							navigator.clipboard.writeText(contentJSONString);
							toast.success(`Copied to clipboard`);
						}}>Copy JSON Output</Button
					>
				</Dialog.Content>
			</Dialog.Root>
		</div>
		<div class="m-auto flex h-[35rem] w-[95%] flex-col rounded border sm:w-[80%]">
			{#if editor && showToolBar}
				<div transition:slide>
					<EdraToolbar {editor} />
				</div>
			{/if}
			<Edra class="overflow-auto" bind:editor {showMenu} bind:content {onUpdate} />
		</div>
	</div>
</div>

<style>
	:global(.edra-toolbar) {
		width: 100%;
		border-bottom-width: 1px;
		padding: 0.25rem;
	}

	.animated-load {
		opacity: 0;
		transform: translateY(-2rem);
		filter: blur(8px);
		animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		will-change: opacity, transform, filter;
		position: relative;
		overflow: hidden;
	}

	@keyframes fadeInUp {
		0% {
			opacity: 0;
			transform: translateY(-2rem);
			filter: blur(8px);
		}

		60% {
			opacity: 0.8;
			transform: translateY(0.2rem);
			filter: blur(2px);
		}

		100% {
			opacity: 1;
			transform: translateY(0);
			filter: blur(0);
		}
	}
</style>
