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
	import { Edra, EdraToolbar } from '$lib/edra/shadcn/index.js';
	import { slide } from 'svelte/transition';
	import defaultContent from '$lib/default_content.js';

	let content = $state<Content>();
	let editor = $state<Editor>();

	$effect(() => {
		console.log('Content', content);
		localStorage.setItem('edra-content', JSON.stringify(content));
	});

	let showToolBar = $state(true);
	let showMenu = $state(true);

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
						{@const stringContent = JSON.stringify(content, null, 2)}
						<ShikiCode class="size-full overflow-auto" code={stringContent} lang="json" />
						<Button
							variant="outline"
							class="ml-auto w-fit"
							onclick={() => {
								navigator.clipboard.writeText(stringContent);
								toast.success(`Copied to clipboard`);
							}}>Copy JSON Output</Button
						>
					</Dialog.Content>
				</Dialog.Root>
			</div>
		</div>
	</div>

	<div class="mx-auto w-[80%] px-4">
		{#if editor && showToolBar}
			<div class="rounded-t border-x border-t p-1">
				<EdraToolbar
					{editor}
					allowedCommands={[
						'undo-redo',
						'headings',
						'link',
						'bold',
						'italic',
						'underline',
						'strike',
						'blockquote',
						'superscript',
						'subscript',
						'code',
						'codeBlock',
						'alignLeft',
						'alignLeft',
						'alignCenter',
						'alignRight',
						'alignJustify',
						'bulletList',
						'orderedList',
						'taskList',
						'audio-placeholder',
						'image-placeholder',
						'video-placeholder',
						'iframe-placeholder',
						'table',
						'fontSize',
						'quickColor',
						'searchAndReplace'
					]}
				/>
			</div>
		{/if}
		<div class="rounded-b border">
			<Edra
				class="h-[35rem] overflow-auto"
				bind:editor
				showBubbleMenu={true}
				{content}
				{onUpdate}
				showSlashCommands={true}
				allowedBubbleMenuCommands={['link', 'bulletList', 'headings', 'quickColor']}
			/>
		</div>
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
