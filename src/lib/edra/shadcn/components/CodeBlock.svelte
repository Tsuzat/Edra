<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import type { NodeViewProps } from '@tiptap/core';
	import { NodeViewContent, NodeViewWrapper } from 'svelte-tiptap';

	const { editor, node, updateAttributes, extension }: NodeViewProps = $props();

	import * as Popover from '$lib/components/ui/popover/index.js';
	import Check from '@lucide/svelte/icons/check';
	import Copy from '@lucide/svelte/icons/copy';
	import * as Command from '$lib/components/ui/command/index.js';
	import { cn } from '$lib/utils.js';
	import strings from '../../strings.js';

	let preRef = $state<HTMLPreElement>();

	let isCopying = $state(false);

	const languages: string[] = $derived(extension.options.lowlight.listLanguages().sort());

	let defaultLanguage = $derived(node.attrs.language ?? strings.extension.code.plainText);

	$effect(() => {
		updateAttributes({ language: defaultLanguage });
	});

	function copyCode() {
		if (!preRef) return;
		isCopying = true;
		navigator.clipboard.writeText(preRef.innerText);
		setTimeout(() => {
			isCopying = false;
		}, 1000);
	}
</script>

<NodeViewWrapper class="code-wrapper" draggable={false} spellcheck={false}>
	<div class="code-wrapper-tile justify-end print:justify-start" contenteditable="false">
		<Popover.Root>
			<Popover.Trigger
				contenteditable="false"
				disabled={!editor.isEditable}
				class={buttonVariants({
					variant: 'ghost',
					class: 'text-muted-foreground h-6! w-fit rounded-sm p-1 capitalize'
				})}
			>
				{defaultLanguage}
			</Popover.Trigger>
			<Popover.Content
				class="text-primary! max-h-96 w-36 p-0"
				portalProps={{ disabled: true, to: undefined }}
				onCloseAutoFocus={(e) => e.preventDefault()}
			>
				<Command.Root>
					<Command.Input placeholder={strings.extension.code.searchLanguagePlaceholder} />
					<Command.List>
						<Command.Empty>{strings.extension.code.searchLanguageEmpty}</Command.Empty>
						<Command.Group value="languages">
							{#each languages as language (language)}
								<Command.Item
									value={language}
									onSelect={() => (defaultLanguage = language)}
									class="text-primary capitalize"
								>
									<Check class={cn(language !== defaultLanguage && 'text-transparent')} />
									{language}
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.List>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
		<Button
			variant="ghost"
			class="text-muted-foreground size-6! rounded-sm p-0.5 print:hidden"
			onclick={copyCode}
		>
			{#if isCopying}
				<Check class="size-4 text-green-500" />
			{:else}
				<Copy class="size-4" />
			{/if}
		</Button>
	</div>
	<pre bind:this={preRef} draggable={false}>
		<NodeViewContent as="code" class={`language-${defaultLanguage}`} {...node.attrs} />
	</pre>
</NodeViewWrapper>
