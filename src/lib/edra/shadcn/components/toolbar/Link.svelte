<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils.js';
	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Link from '@lucide/svelte/icons/link';
	import type { Editor } from '@tiptap/core';
	import EdraToolTip from '../EdraToolTip.svelte';
	import strings from '../../../strings.js';

	interface Props {
		editor: Editor;
		open?: boolean;
	}

	let { editor, open = $bindable(false) }: Props = $props();

	let value = $state<string>();

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
		{@const isActive = editor.isActive('link')}
		<EdraToolTip tooltip={strings.toolbar.link.buttonTitle}>
			<div
				class={buttonVariants({
					variant: 'ghost',
					size: 'icon',
					class: cn('gap-0')
				})}
				class:bg-muted={isActive}
			>
				<Link />
				<ChevronDown class="text-muted-foreground size-2!" />
			</div>
		</EdraToolTip>
	</Popover.Trigger>
	<Popover.Content
		portalProps={{ to: document.getElementById('edra-editor') ?? undefined }}
		class="h-fit w-80 rounded-lg p-0!"
	>
		<form class="flex items-center gap-0.5" onsubmit={handleSubmit}>
			<Input
				placeholder={strings.toolbar.link.insertLinkPlaceholder}
				bind:value
				required
				type="url"
			/>
			<EdraToolTip tooltip={strings.toolbar.link.insertLink}>
				<Button type="submit" size="icon">
					<Check />
				</Button>
			</EdraToolTip>
		</form>
	</Popover.Content>
</Popover.Root>
