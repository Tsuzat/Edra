<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import FileJson from 'lucide-svelte/icons/file-json';
	import { Button, buttonVariants } from '../ui/button/index.js';
	import ShikiCode from './shiki-code.svelte';
	import { toast } from 'svelte-sonner';
	import Expand from 'lucide-svelte/icons/maximize-2';
	import Restore from 'lucide-svelte/icons/minimize-2';
	import { cn } from '$lib/utils.js';
	import type { Editor } from '@tiptap/core';
	import * as Select from '../ui/select/index.js';
	import format from 'html-format';

	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();

	let code = $state(JSON.stringify(editor.getJSON(), null, 2));
	let currentLang = $state<'json' | 'markdown' | 'html'>('json');

	$effect(() => {
		console.log('currentLang', currentLang);
		if (currentLang === 'json') {
			code = JSON.stringify(editor.getJSON(), null, 2);
		} else if (currentLang === 'markdown') {
			code = editor.storage.markdown.getMarkdown();
		} else {
			code = format(editor.getHTML(), ' '.repeat(4));
		}
	});

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

		{#key code + currentLang}
			<ShikiCode class="size-full overflow-auto" {code} lang={currentLang} />
		{/key}

		<div class="mt-4 flex w-full items-center justify-end gap-2">
			<Select.Root type="single" bind:value={currentLang}>
				<Select.Trigger class="w-fit capitalize">
					{currentLang}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.GroupHeading>Output Format</Select.GroupHeading>
						<Select.Item value="json" label="JSON" />
						<Select.Item value="markdown" label="Markdown" />
						<Select.Item value="html" label="HTML" />
					</Select.Group>
				</Select.Content>
			</Select.Root>
			<Button
				variant="outline"
				class="capitalize"
				onclick={() => {
					navigator.clipboard.writeText(code);
					toast.success(`Copied to clipboard`);
				}}>Copy {currentLang} Output</Button
			>
		</div>
	</Dialog.Content>
</Dialog.Root>
