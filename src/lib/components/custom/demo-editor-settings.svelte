<script lang="ts">
	import { buttonVariants } from '../ui/button/button.svelte';
	import { Checkbox } from '../ui/checkbox/index.js';
	import * as Dialog from '../ui/dialog/index.js';
	import Settings from 'lucide-svelte/icons/settings';
	import { Label } from '../ui/label/index.js';

	interface Props {
		showToolBar: boolean;
		showBubbleMenu: boolean;
		editable: boolean;
	}

	let {
		showToolBar = $bindable(true),
		showBubbleMenu = $bindable(true),
		editable = $bindable(true)
	}: Props = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
		<Settings />
		<span>Editor settings</span>
	</Dialog.Trigger>
	<Dialog.Content class="h-fit max-h-[95vh] w-80 max-w-[95vw] p-4">
		<Dialog.Header class="mb-4">
			<Dialog.Title>Edra demo settings</Dialog.Title>
		</Dialog.Header>
		<div class="flex flex-col items-start gap-6">
			<div class="space-y-1">
				<div class="group flex w-full items-center gap-2">
					<Checkbox id="toolbar" bind:checked={showToolBar} />
					<Label for="toolbar" class="w-full cursor-pointer text-sm font-medium leading-none"
						>Show editor toolbar</Label
					>
				</div>
				<p class="text-xs text-muted-foreground">Toggles the main toolbar above the editor with formatting options like headings, bold, italic, etc.</p>
			</div>

			<div class="space-y-1">
				<div class="group flex w-full items-center gap-2">
					<Checkbox id="menus" bind:checked={showBubbleMenu} />
					<Label for="menus" class="w-full cursor-pointer text-sm font-medium leading-none"
						>Show editor bubble menu</Label
					>
				</div>
				<p class="text-xs text-muted-foreground">Displays a floating formatting menu when text is selected in the editor.</p>
			</div>

			<div class="space-y-1">
				<div class="group flex w-full items-center gap-2">
					<Checkbox id="editable" bind:checked={editable} />
					<Label for="editable" class="w-full cursor-pointer text-sm font-medium leading-none"
						>Editable</Label
					>
				</div>
				<p class="text-xs text-muted-foreground">Allows users to directly edit the content. When unchecked, the editor is in read-only mode.</p>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
