<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { commands } from '$lib/edra/commands/index.js';
	import { getEditor, useEditorTransaction } from '$lib/edra/tiptap/index.js';
	import { cn } from '$lib/utils.js';
	import Colors from './tools/Colors.svelte';
	import Export from './tools/Export.svelte';
	import Tooltip from './Tooltip.svelte';
	interface Props {
		class?: string;
	}
	const { class: className }: Props = $props();

	const editor = getEditor();
	const transaction = useEditorTransaction(editor);
	const commandsKeys = Object.keys(commands);

	function isActive(command: (typeof commands)[string][number]): boolean {
		void transaction.version;
		return command.isActive?.(editor) ?? false;
	}
	function isClickable(command: (typeof commands)[string][number]): boolean {
		void transaction.version;
		return command.clickable?.(editor) ?? true;
	}
</script>

<div class={cn('flex items-center h-full w-fit gap-2', className)}>
	{#each commandsKeys as key (key)}
		{@const group = commands[key]}
		{#each group as command, idx (idx)}
			{@const Icon = command.icon}
			<Tooltip tooltip={command.tooltip} shortCut={command.shortCut ?? ''}>
				<Button
					variant="ghost"
					size="icon"
					class={cn(isActive(command) && 'bg-muted text-primary')}
					disabled={!isClickable(command)}
					onclick={() => {
						command.onClick?.(editor);
					}}
				>
					<Icon />
				</Button>
			</Tooltip>
		{/each}
		<Separator orientation="vertical" class="h-6!" />
	{/each}
	<Colors />
	<Export />
</div>
