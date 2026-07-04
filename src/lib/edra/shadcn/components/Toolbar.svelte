<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { commands } from '$lib/edra/commands/index.js';
	import { getEditor } from '$lib/edra/tiptap/index.js';
	import { cn } from '$lib/utils.js';
	import Tooltip from './Tooltip.svelte';
	interface Props {
		class?: string;
		excludedCommands?: string[];
	}
	const { class: className, excludedCommands }: Props = $props();

	const editor = getEditor();
	const commandsKeys = Object.keys(commands).filter((key) => !excludedCommands?.includes(key));
</script>

<div class={cn('flex items-center flex-wrap h-full w-fit gap-2', className)}>
	{#each commandsKeys as key (key)}
		{@const group = commands[key]}
		{#each group as command, idx (idx)}
			{@const Icon = command.icon}
			<Tooltip tooltip={command.tooltip} shortCut={command.shortCut ?? ''}>
				<Button
					variant="ghost"
					size="icon"
					class={cn(command.isActive?.(editor) && 'bg-muted text-primary')}
					disabled={!command.clickable?.(editor)}
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
</div>
