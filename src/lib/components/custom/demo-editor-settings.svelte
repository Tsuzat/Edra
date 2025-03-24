<script lang="ts">
	import { buttonVariants } from '../ui/button/button.svelte';
	import { Checkbox } from '../ui/checkbox/index.js';
	import * as Dialog from '../ui/dialog/index.js';
	import Settings from 'lucide-svelte/icons/settings';
	import { Label } from '../ui/label/index.js';

	interface Props {
		showToolBar: boolean;
		showBubbleMenus: boolean;
		editable: boolean;
	}

	let {
		showToolBar = $bindable(true),
		showBubbleMenus = $bindable(true),
		editable = $bindable(true)
	}: Props = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
		<Settings />
		<span>Demo Settings</span>
	</Dialog.Trigger>
	<Dialog.Content class="h-fit max-h-[95vh] w-80 max-w-[95vw] p-4">
		<Dialog.Header class="mb-4">
			<Dialog.Title>Demo Edra Settings</Dialog.Title>
		</Dialog.Header>
		<div class="flex flex-col items-start gap-6">
			<div class="flex w-full items-center gap-2">
				<Checkbox id="toolbar" bind:checked={showToolBar} />
				<Label for="toolbar" class="w-full cursor-pointer text-sm font-medium leading-none"
					>Show Editor Toolbar</Label
				>
			</div>
			<div class="flex w-full items-center gap-2">
				<Checkbox id="menus" bind:checked={showBubbleMenus} />
				<Label for="menus" class="w-full cursor-pointer text-sm font-medium leading-none"
					>Show Editor Menus</Label
				>
			</div>
			<div class="flex w-full items-center gap-2">
				<Checkbox id="editable" bind:checked={editable} />
				<Label for="editable" class="w-full cursor-pointer text-sm font-medium leading-none"
					>Editable</Label
				>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
