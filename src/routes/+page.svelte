<script lang="ts">
	import { resolve } from '$app/paths';
	import ToggleMode from '$lib/components/custom/ToggleMode.svelte';
	import { createEditor, Edra, type Content } from '$lib/edra/shadcn/index.js';
	import { onMount } from 'svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ChevronDown, FileText, Monitor, Smartphone, Tablet } from '@lucide/svelte';
	import Github from '$lib/components/custom/icons/Github.svelte';
	import { getKeyboardShortcut } from '$lib/edra/utils.js';
	import Polar from '$lib/components/custom/icons/Polar.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import Code from '$lib/components/custom/docs/Code.svelte';
	import { exampleCode } from './code.ts';
	import { cn } from '$lib/utils.js';
	import { DotPattern } from '$lib/components/magic/dot-pattern/index.js';

	/** Sample mock callAI for testing — streams a generic paragraph word-by-word */
	async function sampleCallAI(
		_prompt: string,
		onChunk: (chunk: string) => void,
		onError: (error: Error) => void
	) {
		const paragraph =
			'The quick brown fox jumps over the lazy dog. ' +
			'This is a sample paragraph generated for testing purposes. ' +
			'It demonstrates how the AI streaming interface works by delivering content word by word. ' +
			'Each word arrives with a small delay to simulate real-time generation from an AI model.';
		const words = paragraph.split(' ');
		try {
			for (const word of words) {
				await new Promise((r) => setTimeout(r, 100));
				onChunk(word + ' ');
			}
		} catch (error) {
			onError(error instanceof Error ? error : new Error(String(error)));
		}
	}

	const onUpdate = () => {
		localStorage.setItem('edra-content', JSON.stringify(editor?.getJSON()));
	};
	const editor = createEditor({
		onUpdate,
		callAI: sampleCallAI
	});

	onMount(() => {
		const content = JSON.parse(localStorage.getItem('edra-content') || '[]') as Content;
		editor?.commands.setContent(content, { contentType: 'json' });
	});
	let device = $state<'mobile' | 'tablet' | 'desktop'>('desktop');
</script>

<svelte:head>
	<title>Edra | Best Rich Text Editor for Svelte</title>
</svelte:head>

<header class="flex items-center justify-between p-4">
	<div class="flex items-center gap-2">
		<a class="nodefault flex items-center gap-2" href={resolve('/')}>
			<img src="/favicon.svg" alt="Edra" class="size-8" />
			<span class="text-xl font-semibold">Edra</span>
		</a>
		<span class="w-4"></span>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Button class="text-muted-foreground" variant="ghost">
					Editor
					<ChevronDown class="size-2.5!" />
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Item>Shadcn</DropdownMenu.Item>
				<DropdownMenu.Item>Headless</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Button class="text-muted-foreground" variant="ghost">
					Templates
					<ChevronDown class="size-2.5!" />
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					<DropdownMenu.GroupHeading class="text-xs text-muted-foreground"
						>Shadcn Based</DropdownMenu.GroupHeading
					>
					<DropdownMenu.Item>Simple</DropdownMenu.Item>
					<DropdownMenu.Item>AI Editor</DropdownMenu.Item>
					<DropdownMenu.Item>Notion Like</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
	<div class="flex items-center gap-2">
		<Button class="text-muted-foreground" variant="outline">
			<span>Search Document</span>
			<span class="bg-muted text-sm px-1 rounded">{getKeyboardShortcut('K', true)}</span>
		</Button>
		<Button variant="ghost" class="nodefault" href="https://github.com/Tsuzat/Edra">
			<Github />
			<span class="text-muted-foreground">622</span>
		</Button>
		<ToggleMode />
	</div>
</header>
<div class="absolute mx-auto -z-10! size-120 left-[calc(50%-15rem)] rounded-full overflow-hidden">
	<DotPattern
		glow={true}
		class={cn('mask-[radial-gradient(300px_circle_at_center,white,transparent)]')}
	/>
</div>

<div class="my-28 mx-auto z-10! flex flex-col gap-6 w-full text-center">
	<h1>Rich Editor for Svelte</h1>
	<span class="text-muted-foreground">Thoughtfully designed. Copy and paste into your apps. </span>
	<div class="flex items-center justify-center gap-2">
		<Button class="nodefault" href={resolve('/docs')}>
			<FileText />
			View Docs</Button
		>
		<Button
			class="nodefault"
			href="https://buy.polar.sh/polar_cl_PyqVtv10TGDa7oXeYvVEYg14xelE51X15Z5pJ49CKgc"
		>
			<Polar />
			Support Us</Button
		>
	</div>
</div>
<div class="flex items-center justify-center w-[95%] mx-auto">
	<Tabs.Root value="preview" class="w-full">
		<div class="flex items-center justify-between">
			<Tabs.List class="flex items-center justify-center">
				<Tabs.Trigger value="preview">Preview</Tabs.Trigger>
				<Tabs.Trigger value="code">Code</Tabs.Trigger>
			</Tabs.List>
			<div>
				<Tabs.Root bind:value={device}>
					<Tabs.List>
						<Tabs.Trigger value="desktop">
							<Monitor />
						</Tabs.Trigger>
						<Tabs.Trigger value="tablet">
							<Tablet />
						</Tabs.Trigger>
						<Tabs.Trigger value="mobile">
							<Smartphone />
						</Tabs.Trigger>
					</Tabs.List>
				</Tabs.Root>
			</div>
		</div>
		<Tabs.Content value="preview">
			<div
				class={cn(
					'border rounded-lg transition-all duration-500',
					device === 'desktop' && 'max-w-full',
					device === 'tablet' && 'max-w-xl',
					device === 'mobile' && 'max-w-sm'
				)}
			>
				<Edra {editor}>
					<Edra.UseAI />
					<Edra.Toolbar
						class="border-b rounded-t-lg max-w-full scrollbar-none bg-muted dark:bg-muted/50 p-1 overflow-x-scroll"
					/>
					<Edra.BubbleMenu />
					<Edra.Content
						class="*:outline-none cursor-auto h-150 w-full overflow-y-scroll py-4 px-8"
					/>
					<Edra.DragHandle />
				</Edra>
			</div>
		</Tabs.Content>
		<Tabs.Content value="code">
			<Code code={exampleCode} language="svelte" />
		</Tabs.Content>
	</Tabs.Root>
</div>
