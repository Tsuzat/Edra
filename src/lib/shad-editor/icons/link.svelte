<script lang="ts">
	import { Link } from 'lucide-svelte';
	import { ChevronDown } from 'lucide-svelte';
	import { X } from 'lucide-svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { ToolBarIconProps } from './types.js';

	let { editor, toolTipProps = { delayDuration: 0, disabled: false } }: ToolBarIconProps = $props();

	function setLink(url: string) {
		if (url.trim() === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();
			return;
		}
		editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
	}
</script>

<Popover.Root>
	<Popover.Trigger>
		<Tooltip.Provider {...toolTipProps}>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button
						variant="ghost"
						size="sm"
						class={cn('h-8 gap-1 p-1', editor.isActive('link') && 'bg-muted')}
					>
						<Link />
						<ChevronDown class="!size-2 text-muted-foreground" />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Add Or Remove Link</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</Popover.Trigger>
	<Popover.Content class="bg-popover shadow-lg *:my-2">
		<div class="flex items-center justify-between">
			<h1 class="text-xl font-bold">Link</h1>
			<Popover.Close>
				<X class="size-4 text-muted-foreground" />
			</Popover.Close>
		</div>
		<p>Insert or remove link from selected text.</p>
		<Input
			placeholder="Enter link to attach.."
			value={editor?.getAttributes('link').href}
			onchange={(e) => {
				//@ts-ignore
				if (e !== null && e.target !== null) setLink(e.target.value);
			}}
			class="w-full"
		/>
		<div class="flex items-center justify-end gap-2">
			<Button size="sm" onclick={() => {}}>
				<Popover.Close>Insert</Popover.Close>
			</Button>
			<Button
				variant="destructive"
				onclick={() => {
					editor.chain().focus().extendMarkRange('link').unsetLink().run();
				}}>Remove</Button
			>
		</div>
	</Popover.Content>
</Popover.Root>
