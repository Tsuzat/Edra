<script lang="ts">
	import { quickcolors } from '../../../utils.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils.js';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import type { Editor } from '@tiptap/core';
	import EdraToolTip from '../EdraToolTip.svelte';
	import strings from '../../../strings.js';

	interface Props {
		class?: string;
		editor: Editor;
	}
	const { class: className = '', editor }: Props = $props();

	const currentColor = $derived.by(() => editor.getAttributes('textStyle').color);
	const currentHighlight = $derived.by(() => editor.getAttributes('highlight').color);
</script>

<Popover.Root>
	<Popover.Trigger>
		<EdraToolTip tooltip={strings.toolbar.color.buttonTitle}>
			<div
				class={buttonVariants({
					variant: 'ghost',
					size: 'icon',
					class: cn('gap-0.5', className)
				})}
				style={`color: ${currentColor}; background-color: ${currentHighlight}75;`}
			>
				<span>{strings.toolbar.color.templateCharacter}</span>
				<ChevronDown class="text-muted-foreground size-2!" />
			</div>
		</EdraToolTip>
	</Popover.Trigger>
	<Popover.Content class="size-fit shadow-lg" portalProps={{ disabled: true, to: undefined }}>
		<div class="text-muted-foreground my-2 text-xs">{strings.toolbar.color.textColors}</div>
		<div class="grid grid-cols-5 gap-2">
			{#each quickcolors as color (color)}
				<Button
					variant="ghost"
					class={cn(
						`size-6 border-0 p-0 font-normal`,
						editor.isActive('textStyle', { color: color.value }) && 'border-2 font-extrabold',
						color.value === '' && 'border'
					)}
					style={`color: ${color.value}; background-color: ${color.value}50; border-color: ${color.value};`}
					title={color.label}
					onclick={() => {
						if (color.value === '' || color.label === strings.toolbar.color.default)
							editor.chain().focus().unsetColor().run();
						else
							editor
								.chain()
								.focus()
								.setColor(currentColor === color.value ? '' : color.value)
								.run();
					}}
				>
					{strings.toolbar.color.templateCharacter}
				</Button>
			{/each}
		</div>
		<div class="text-muted-foreground my-2 text-xs">{strings.toolbar.color.highlightColors}</div>
		<div class="grid grid-cols-5 gap-2">
			{#each quickcolors as color (color)}
				<Button
					variant="ghost"
					class={cn(
						`size-6 border-0 p-0 font-normal`,
						editor.isActive('highlight', { color: color.value }) && 'border-2',
						color.value === '' && 'border'
					)}
					style={`background-color: ${color.value}50; border-color: ${color.value};`}
					title={color.label}
					onclick={() => {
						if (color.value === '' || color.label === strings.toolbar.color.default)
							editor.chain().focus().unsetHighlight().run();
						else editor.chain().focus().toggleHighlight({ color: color.value }).run();
					}}
					>{strings.toolbar.color.templateCharacter}
				</Button>
			{/each}
		</div>
	</Popover.Content>
</Popover.Root>
