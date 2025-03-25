<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import FileJson from 'lucide-svelte/icons/file-json';
	import { Button, buttonVariants } from '../ui/button/index.js';
	import ShikiCode from './shiki-code.svelte';
	import { toast } from 'svelte-sonner';
	import Expand from 'lucide-svelte/icons/maximize-2';
	import Restore from 'lucide-svelte/icons/minimize-2';
	import { cn } from '$lib/utils.js';

	interface Props {
		code: string;
		onReset?: () => void;
	}

	let { code, onReset }: Props = $props();

	let expand = $state(false);

	function handleExpand() {
		expand = !expand;
	}
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
		<FileJson /> Show output
	</Dialog.Trigger>
	<Dialog.Content
		class={cn(
			'h-[95%] w-[95vw] transition-all duration-500 sm:h-[80%] sm:min-w-[50%]',
			expand && 'sm:h-[95%] sm:min-w-[95vw]'
		)}
	>
		<Button
			variant="ghost"
			class="absolute right-12 top-4 hidden size-4 rounded-sm bg-muted p-0 text-muted-foreground opacity-70 hover:opacity-100 sm:inline-flex"
			title={expand ? 'Restore' : 'Expand'}
			onclick={handleExpand}
		>
			{#if expand}
				<Restore class="!size-3" />
			{:else}
				<Expand class="!size-3" />
			{/if}
		</Button>
		<Dialog.Header>
			<Dialog.Title>JSON Output</Dialog.Title>
			<Dialog.Description>Observe the JSON output of the editor content</Dialog.Description>
		</Dialog.Header>

		<ShikiCode class="size-full overflow-auto" {code} lang="json" />

		<div class="mt-4 flex w-full items-center justify-end gap-2">
			<Button
				variant="outline"
				onclick={() => {
					navigator.clipboard.writeText(code);
					toast.success(`Copied to clipboard`);
				}}>Copy JSON Output</Button
			>
			<Button variant="destructive" onclick={onReset}>Reset to Default</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
