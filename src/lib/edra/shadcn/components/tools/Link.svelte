<script lang="ts">
	import { buttonVariants, Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Link from '@lucide/svelte/icons/link-2';
	import Tooltip from '../Tooltip.svelte';
	import { getEditor, useEditorTransaction } from '$lib/edra/tiptap/index.js';

	let open = $state(false);

	let value = $state<string>();
	const editor = getEditor();
	const transaction = useEditorTransaction(editor);
	function isActive() {
		void transaction.version;
		return editor.isActive('link');
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (value === undefined || value.trim() === '') return;
		editor.chain().focus().setLink({ href: value }).run();
		value = undefined;
		open = false;
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger>
		<Tooltip tooltip="Link">
			<div
				class={buttonVariants({
					variant: 'ghost',
					size: 'icon'
				})}
				class:bg-muted={isActive()}
			>
				<Link />
				<ChevronDown class="size-2! text-muted-foreground" />
			</div>
		</Tooltip>
	</Popover.Trigger>
	<Popover.Content
		portalProps={{ to: document.getElementById('nota-editor') ?? undefined }}
		class="h-fit w-80 rounded-lg p-0!"
	>
		<form class="flex items-center gap-0.5" onsubmit={handleSubmit}>
			<Input placeholder="Type or paste a link..." bind:value required type="url" />
			<Tooltip tooltip="Insert link">
				<Button type="submit" size="icon">
					<Check />
				</Button>
			</Tooltip>
		</form>
	</Popover.Content>
</Popover.Root>
