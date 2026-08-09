<script lang="ts">
	import { resolve } from '$app/paths';
	import ToggleMode from '$lib/components/custom/ToggleMode.svelte';
	import { createEditor, Edra, type Content } from '$lib/edra/shadcn/index.js';
	import { onMount } from 'svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		ChevronDown,
		FileText,
		Monitor,
		Search,
		Smartphone,
		Tablet,
		Menu,
		Phone,
		Coffee,
		Play
	} from '@lucide/svelte';
	import Github from '$lib/components/custom/icons/Github.svelte';
	import { getKeyboardShortcut } from '$lib/edra/utils.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import Code from '$lib/components/custom/docs/Code.svelte';
	import { exampleCode } from './code.ts';
	import { cn } from '$lib/utils.js';
	import { DotPattern } from '$lib/components/magic/dot-pattern/index.js';
	import { openSearch } from '$lib/components/custom/docs/Search.svelte';
	import sampleContent from './sample-content.ts';
	import { getGithubStars } from './data.remote.ts';

	const onUpdate = () => {
		localStorage.setItem('edra-content', JSON.stringify(editor?.getJSON()));
	};
	const editor = createEditor({
		onUpdate
	});

	onMount(() => {
		let content = sampleContent as Content;
		try {
			const saved = localStorage.getItem('edra-content');
			if (saved && saved !== '[]') {
				content = JSON.parse(saved) as Content;
			}
		} catch (e) {
			console.error('Failed to parse local content', e);
		}
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
		<span class="hidden w-4 md:inline-block"></span>
		<div class="hidden items-center gap-2 md:flex">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button class="text-muted-foreground" variant="ghost">
						Editor
						<ChevronDown class="size-2.5!" />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<a class="nodefault" href="#shadcn">
						<DropdownMenu.Item>Shadcn</DropdownMenu.Item>
					</a>
					<a class="nodefault" href={resolve('/headless')}>
						<DropdownMenu.Item>Headless</DropdownMenu.Item>
					</a>
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
						<a class="nodefault" href={resolve('/templates/simple')}>
							<DropdownMenu.Item class="cursor-pointer">Simple</DropdownMenu.Item>
						</a>
						<a class="nodefault" href={resolve('/templates/ai')}>
							<DropdownMenu.Item class="cursor-pointer">AI Editor</DropdownMenu.Item>
						</a>
						<a class="nodefault" href={resolve('/templates/notion')}>
							<DropdownMenu.Item class="cursor-pointer">Notion Like</DropdownMenu.Item>
						</a>
						<a class="nodefault" href={resolve('/realtime')}>
							<DropdownMenu.Item>Realtime</DropdownMenu.Item>
						</a>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
	<div class="flex items-center gap-1 md:gap-2">
		<div class="flex items-center md:hidden">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button class="text-muted-foreground" variant="ghost" size="icon">
						<Menu class="size-5" />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.GroupHeading class="text-xs text-muted-foreground"
							>Editor</DropdownMenu.GroupHeading
						>
						<a class="nodefault" href="#shadcn">
							<DropdownMenu.Item>Shadcn</DropdownMenu.Item>
						</a>
						<a class="nodefault" href={resolve('/headless')}>
							<DropdownMenu.Item>Headless</DropdownMenu.Item>
						</a>
					</DropdownMenu.Group>
					<DropdownMenu.Separator />
					<DropdownMenu.Group>
						<DropdownMenu.GroupHeading class="text-xs text-muted-foreground"
							>Templates</DropdownMenu.GroupHeading
						>
						<a class="nodefault" href={resolve('/templates/simple')}>
							<DropdownMenu.Item class="cursor-pointer">Simple</DropdownMenu.Item>
						</a>
						<a class="nodefault" href={resolve('/templates/ai')}>
							<DropdownMenu.Item class="cursor-pointer">AI Editor</DropdownMenu.Item>
						</a>
						<a class="nodefault" href={resolve('/templates/notion')}>
							<DropdownMenu.Item class="cursor-pointer">Notion Like</DropdownMenu.Item>
						</a>
						<a class="nodefault" href={resolve('/realtime')}>
							<DropdownMenu.Item>Realtime</DropdownMenu.Item>
						</a>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
		<Button onclick={openSearch} class="hidden text-muted-foreground md:flex" variant="outline">
			<Search />
			<span>Search Document</span>
			<span class="rounded bg-muted px-1 text-sm">{getKeyboardShortcut('K', true)}</span>
		</Button>
		<Button
			onclick={openSearch}
			class="flex text-muted-foreground md:hidden"
			variant="ghost"
			size="icon"
		>
			<Search />
		</Button>
		<Button variant="ghost" class="nodefault hidden md:flex" href="https://github.com/Tsuzat/Edra">
			<Github />
			<span class="text-muted-foreground">{await getGithubStars()}</span>
		</Button>
		<Button
			variant="ghost"
			class="nodefault flex md:hidden"
			size="icon"
			href="https://github.com/Tsuzat/Edra"
		>
			<Github />
		</Button>
		<ToggleMode />
	</div>
</header>
<div class="absolute left-[calc(50%-15rem)] -z-10! mx-auto size-120 overflow-hidden rounded-full">
	<DotPattern
		glow={true}
		class={cn('mask-[radial-gradient(300px_circle_at_center,white,transparent)]')}
	/>
</div>

<div class="z-10! mx-auto my-28 flex w-full flex-col gap-6 text-center">
	<h1>Rich Editor for Svelte</h1>
	<span class="text-muted-foreground">Thoughtfully designed. Copy and paste into your apps. </span>
	<div class="flex items-center justify-center gap-2">
		<Button class="nodefault" href={resolve('/docs')}>
			<FileText />
			View Docs</Button
		>
		<Button
			class="nodefault"
			href="https://www.buymeacoffee.com/tsuzat"
			aria-label="Buy me a coffee"
		>
			<Coffee />
			Buy me a coffee
		</Button>
		<Button class="nodefault" href="https://cal.com/tsuzat/qc">
			<Phone />
			Quick Connect
		</Button>
	</div>
	<Button class="nodefault mx-auto w-fit" variant="outline" href={resolve('/realtime')}>
		<Play />
		<span
			class="bg-linear-to-r from-[oklch(0.5_0.22_264)] via-[oklch(0.56_0.2_294)] to-[oklch(0.62_0.19_322)] bg-clip-text font-bold text-transparent dark:from-[oklch(0.68_0.18_264)] dark:via-[oklch(0.72_0.16_294)] dark:to-[oklch(0.76_0.14_322)]"
		>
			Try Realtime Collaboration</span
		>
	</Button>
</div>
<div class="mx-auto flex w-[95%] items-center justify-center">
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
		<Tabs.Content id="shadcn" value="preview">
			<div
				class={cn(
					'rounded-lg border transition-all duration-500',
					device === 'desktop' && 'max-w-full',
					device === 'tablet' && 'max-w-xl',
					device === 'mobile' && 'max-w-sm'
				)}
			>
				<Edra {editor}>
					<Edra.Toolbar
						class="max-w-full scrollbar-none overflow-x-scroll rounded-t-lg border-b bg-muted p-1 dark:bg-muted/50"
					/>
					<Edra.Content
						class="h-150 w-full cursor-auto overflow-y-scroll px-8 py-4 text-base *:outline-none"
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
