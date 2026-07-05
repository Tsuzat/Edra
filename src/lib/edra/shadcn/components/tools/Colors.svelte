<script lang="ts">
	import { quickcolors } from '../../../utils.ts';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils.js';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Tooltip from '../Tooltip.svelte';
	import { getEditor, useEditorState } from '$lib/edra/tiptap/index.js';

	let open = $state(false);
	const editor = getEditor();
	const editorState = useEditorState({
		editor,
		selector: ({ editor }) => ({
			currentColor: editor.getAttributes('textStyle').color,
			currentHighlight: editor.getAttributes('highlight').color,
			isActive(name: string, opts: Record<string, any>) {
				return editor.isActive(name, opts) ?? false;
			}
		})
	});

	const currentColor = $editorState.currentColor;
	const currentHighlight = $editorState.currentHighlight;
</script>

<Popover.Root bind:open>
	<Tooltip tooltip="Quick Colors">
		<Popover.Trigger
			class={buttonVariants({
				variant: 'ghost',
				size: 'icon',
				class: cn('gap-0.5')
			})}
			style={`color: ${currentColor}; background-color: ${currentHighlight}75;`}
		>
			<span>A</span>
			<ChevronDown class="text-muted-foreground size-2!" />
		</Popover.Trigger>
	</Tooltip>
	<Popover.Content class="size-fit shadow-lg">
		<div class="text-muted-foreground my-2 text-xs">Text Colors</div>
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
						if (color.value === '' || color.label === 'Default')
							editor.chain().focus().unsetColor().run();
						else
							editor
								.chain()
								.focus()
								.setColor(currentColor === color.value ? '' : color.value)
								.run();
					}}
				>
					A
				</Button>
			{/each}
		</div>
		<div class="text-muted-foreground my-2 text-xs">Background Colors</div>
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
						if (color.value === '' || color.label === 'Default')
							editor.chain().focus().unsetHighlight().run();
						else
							editor
								.chain()
								.focus()
								.toggleHighlight({ color: `${color.value}50` })
								.run();
					}}>A</Button
				>
			{/each}
		</div>
	</Popover.Content>
</Popover.Root>
