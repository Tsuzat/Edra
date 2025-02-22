<script lang="ts">
	import {
		ArrowDown,
		ChevronDown,
		Code,
		DiamondMinus,
		Download,
		FileJson,
		FileText
	} from 'lucide-svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { downloadFile } from '../custom/utils.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { ToolBarIconProps } from './types.js';

	let { editor, toolTipProps = { delayDuration: 0, disabled: false } }: ToolBarIconProps = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Tooltip.Provider {...toolTipProps}>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button variant="ghost" size="sm" class="h-8">
						<Download />
						<ChevronDown class="size-3 text-muted-foreground" />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Export Data</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-48 p-2">
		<DropdownMenu.Item onclick={() => downloadFile(editor.getHTML(), 'data.html')}>
			<Code />
			<span>Export as HTML</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item
			onclick={() => downloadFile(editor.storage.markdown.getMarkdown(), 'data.md')}
		>
			<DiamondMinus />
			<span>Export as Markdown</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => downloadFile(editor.getText(), 'data.txt')}>
			<FileText />
			<span>Export as Text</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => downloadFile(JSON.stringify(editor.getJSON()), 'data.json')}>
			<FileJson />
			<span>Export as JSON</span>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
