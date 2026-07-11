<script lang="ts" module>
	let open = $state(false);

	export const openSearch = () => {
		open = true;
	};
</script>

<script lang="ts">
	import * as Command from '$lib/components/ui/command/index.js';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import {
		BookOpen,
		Download,
		Rocket,
		Table,
		ListTodo,
		Type,
		Calculator,
		BookMarked,
		FileImage,
		Megaphone,
		Move,
		CodeXml,
		Sparkles,
		Terminal,
		Sliders,
		Globe,
		SlidersHorizontal,
		Settings,
		ListOrdered,
		Database
	} from '@lucide/svelte';

	function handleKeydown(e: KeyboardEvent) {
		if ((e.key === 'j' || e.key === 'k') && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = !open;
		}
	}

	const searchItems = [
		{
			title: 'Introduction',
			url: resolve('/docs'),
			keywords: ['intro', 'welcome', 'overview', 'readme', 'about', 'edra'],
			icon: BookOpen,
			group: 'Getting Started'
		},
		{
			title: 'Installation',
			url: resolve('/docs/installation'),
			keywords: ['install', 'setup', 'npm', 'pnpm', 'bun', 'add', 'package'],
			icon: Download,
			group: 'Getting Started'
		},
		{
			title: 'Configuration & API',
			url: resolve('/docs/configuration'),
			keywords: ['config', 'setup', 'api', 'props', 'onFileUpload', 'createEditor', 'init'],
			icon: Settings,
			group: 'Getting Started'
		},
		{
			title: 'Data & Serialization',
			url: resolve('/docs/usages/serialization'),
			keywords: ['json', 'html', 'markdown', 'extract', 'save', 'load', 'content', 'data'],
			icon: Database,
			group: 'Getting Started'
		},
		{
			title: 'Starter Kit Extension',
			url: resolve('/docs/extensions/starter-kit'),
			keywords: ['extensions', 'starter', 'kit', 'basic', 'default', 'core'],
			icon: Rocket,
			group: 'Extensions & Plugins'
		},
		{
			title: 'Tables Extension',
			url: resolve('/docs/extensions/tables'),
			keywords: ['table', 'column', 'row', 'grid', 'data', 'grip'],
			icon: Table,
			group: 'Extensions & Plugins'
		},
		{
			title: 'Task List Extension',
			url: resolve('/docs/extensions/tasks'),
			keywords: ['task', 'todo', 'list', 'checkbox', 'done', 'checklist'],
			icon: ListTodo,
			group: 'Extensions & Plugins'
		},
		{
			title: 'Table of Contents',
			url: resolve('/docs/extensions/table-of-contents'),
			keywords: ['toc', 'outline', 'sidebar', 'headings', 'navigation', 'scroll', 'spy'],
			icon: ListOrdered,
			group: 'Extensions & Plugins'
		},
		{
			title: 'Typography & Colors',
			url: resolve('/docs/extensions/typography-and-colors'),
			keywords: ['type', 'heading', 'color', 'text', 'font', 'highlight', 'bold', 'italic'],
			icon: Type,
			group: 'Extensions & Plugins'
		},
		{
			title: 'Mathematics Extension',
			url: resolve('/docs/extensions/mathematics'),
			keywords: ['math', 'katex', 'latex', 'equation', 'formula', 'block', 'inline'],
			icon: Calculator,
			group: 'Extensions & Plugins'
		},
		{
			title: 'Markdown Extension',
			url: resolve('/docs/extensions/markdown'),
			keywords: ['md', 'markdown', 'shortcuts', 'import', 'export', 'serialize'],
			icon: BookMarked,
			group: 'Extensions & Plugins'
		},
		{
			title: 'Media & Mermaid Extension',
			url: resolve('/docs/extensions/media-and-mermaid'),
			keywords: ['image', 'video', 'iframe', 'media', 'mermaid', 'chart', 'diagram', 'graph'],
			icon: FileImage,
			group: 'Extensions & Plugins'
		},
		{
			title: 'Callouts Extension',
			url: resolve('/docs/extensions/callout'),
			keywords: ['callout', 'warning', 'info', 'alert', 'box', 'tip', 'note'],
			icon: Megaphone,
			group: 'Extensions & Plugins'
		},
		{
			title: 'Drag Handle Extension',
			url: resolve('/docs/extensions/drag-handle'),
			keywords: ['drag', 'grip', 'move', 'handle', 'block', 'paragraph'],
			icon: Move,
			group: 'Extensions & Plugins'
		},
		{
			title: 'Codeblock Extension',
			url: resolve('/docs/extensions/code-block'),
			keywords: ['code', 'pre', 'highlight', 'syntax', 'block', 'shiki'],
			icon: CodeXml,
			group: 'Extensions & Plugins'
		},
		{
			title: 'AI Assistant Extension',
			url: resolve('/docs/extensions/ai'),
			keywords: ['ai', 'copilot', 'writing', 'improve', 'assistant', 'prompt', 'stream'],
			icon: Sparkles,
			group: 'Extensions & Plugins'
		},
		{
			title: 'Slash Command Extension',
			url: resolve('/docs/extensions/slash-command'),
			keywords: ['slash', 'command', 'trigger', 'menu', '/', 'quick'],
			icon: Terminal,
			group: 'Extensions & Plugins'
		},
		{
			title: 'Customizing Extensions',
			url: resolve('/docs/customization'),
			keywords: ['custom', 'config', 'extend', 'options', 'theme', 'settings'],
			icon: SlidersHorizontal,
			group: 'Customization'
		},
		{
			title: 'Typography & Styling',
			url: resolve('/docs/customization/styling'),
			keywords: ['type', 'font', 'color', 'style', 'custom', 'theme', 'css', 'design'],
			icon: Type,
			group: 'Customization'
		},
		{
			title: 'Localization & Strings',
			url: resolve('/docs/customization/localization'),
			keywords: ['language', 'i18n', 'translation', 'locale', 'multi', 'text', 'strings'],
			icon: Globe,
			group: 'Customization'
		},
		{
			title: 'Simple Editor Template',
			url: resolve('/templates/simple'),
			keywords: ['simple', 'focus', 'minimal', 'clean', 'distraction', 'template', 'layout'],
			icon: BookOpen,
			group: 'Templates'
		},
		{
			title: 'AI Editor Template',
			url: resolve('/templates/ai'),
			keywords: ['ai', 'copilot', 'assistant', 'chat', 'write', 'prompt', 'template'],
			icon: Sparkles,
			group: 'Templates'
		},
		{
			title: 'Notion Like Template',
			url: resolve('/templates/notion'),
			keywords: ['notion', 'workspace', 'drag', 'toc', 'full', 'width', 'cover', 'template'],
			icon: Table,
			group: 'Templates'
		}
	];

	const groups = [
		{
			name: 'Getting Started',
			items: searchItems.filter((item) => item.group === 'Getting Started')
		},
		{
			name: 'Extensions & Plugins',
			items: searchItems.filter((item) => item.group === 'Extensions & Plugins')
		},
		{
			name: 'Customization',
			items: searchItems.filter((item) => item.group === 'Customization')
		},
		{
			name: 'Templates',
			items: searchItems.filter((item) => item.group === 'Templates')
		}
	];
</script>

<svelte:document onkeydown={handleKeydown} />

<Command.Dialog bind:open>
	<Command.Input placeholder="Type a command or search documentation..." />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>
		{#each groups as group (group.name)}
			<Command.Group heading={group.name}>
				{#each group.items as item (item.title)}
					<Command.Item
						value="{item.title} {item.keywords.join(' ')}"
						onSelect={() => {
							goto(item.url);
							open = false;
						}}
						class="cursor-pointer"
					>
						<item.icon class="me-2 size-4" />
						<span>{item.title}</span>
					</Command.Item>
				{/each}
			</Command.Group>
			<Command.Separator />
		{/each}
	</Command.List>
</Command.Dialog>
