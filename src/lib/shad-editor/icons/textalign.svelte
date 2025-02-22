<script lang="ts">
	import {
		AlignCenter,
		AlignLeft,
		AlignRight,
		AlignJustify,
		ChevronDown,
		Check
	} from 'lucide-svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { ToolBarIconProps } from './types.js';

	let { editor, toolTipProps = { delayDuration: 0, disabled: false } }: ToolBarIconProps = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Tooltip.Provider {...toolTipProps}>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button variant="ghost" size="sm" class="h-8 gap-1 p-1">
						{#if editor.isActive({ textAlign: 'left' })}
							<AlignLeft />
						{:else if editor.isActive({ textAlign: 'center' })}
							<AlignCenter />
						{:else if editor.isActive({ textAlign: 'right' })}
							<AlignRight />
						{:else if editor.isActive({ textAlign: 'justify' })}
							<AlignJustify />
						{:else}
							<AlignLeft />
						{/if}
						<ChevronDown class="!size-2 text-muted-foreground" />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Text Alignment</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-40">
		<DropdownMenu.Item
			onclick={() => editor.chain().focus().setTextAlign('left').run()}
			closeOnSelect={false}
		>
			<AlignLeft /> Align Left
			{#if editor.isActive({ textAlign: 'left' })}
				<Check class="absolute right-2 !size-3 text-muted-foreground" />
			{/if}
		</DropdownMenu.Item>
		<DropdownMenu.Item
			onclick={() => editor.chain().focus().setTextAlign('center').run()}
			closeOnSelect={false}
		>
			<AlignCenter /> Align Center
			{#if editor.isActive({ textAlign: 'center' })}
				<Check class="absolute right-2 !size-3 text-muted-foreground" />
			{/if}
		</DropdownMenu.Item>
		<DropdownMenu.Item
			onclick={() => editor.chain().focus().setTextAlign('right').run()}
			closeOnSelect={false}
		>
			<AlignRight /> Align Right
			{#if editor.isActive({ textAlign: 'right' })}
				<Check class="absolute right-2 !size-3 text-muted-foreground" />
			{/if}
		</DropdownMenu.Item>
		<DropdownMenu.Item
			onclick={() => editor.chain().focus().setTextAlign('justify').run()}
			closeOnSelect={false}
		>
			<AlignJustify /> Align Justify
			{#if editor.isActive({ textAlign: 'justify' })}
				<Check class="absolute right-2 !size-3 text-muted-foreground" />
			{/if}
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
