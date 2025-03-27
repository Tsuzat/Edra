<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { Editor } from '@tiptap/core';
	import { icons } from 'lucide-svelte';
	import { turnIntoCommands } from './turn-into-commands.js';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import { Button } from '$lib/components/ui/button/index.js';
	import EdraToolTip from '$lib/edra/shadcn/components/EdraToolTip.svelte';
	import EllipsisVertical from 'lucide-svelte/icons/ellipsis-vertical';
	import Check from 'lucide-svelte/icons/check';
	import { cn } from '$lib/utils.js';

	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<EdraToolTip content="Turn Into">
			<Button variant="ghost" class="h-8 w-fit gap-0.5 p-2">
				<EllipsisVertical />
				<ChevronDown class="!size-2 text-muted-foreground" />
			</Button>
		</EdraToolTip>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content
		class="z-50 w-40 rounded-md bg-popover"
		portalProps={{ disabled: true, to: undefined }}
	>
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading class="font-medium text-muted-foreground"
				>Turn Into</DropdownMenu.GroupHeading
			>
			{#each turnIntoCommands as command}
				{@const isActive = command.isActive?.(editor) || editor.isActive(command.name)}
				<DropdownMenu.Item onclick={() => command.action(editor)}>
					{@const Icon = icons[command.iconName]}
					<Icon />
					<span>{command.label}</span>
					{#if isActive}
						<Check class="ml-auto !size-3" />
					{/if}
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
