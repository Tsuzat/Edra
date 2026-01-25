<script lang="ts">
import type { NodeViewProps } from '@tiptap/core';

const { editor }: NodeViewProps = $props();

import {Button, buttonVariants } from '$lib/components/ui/button/index.js';
import { Input } from '$lib/components/ui/input/index.js';
import * as Popover from '$lib/components/ui/popover/index.js';
import CodeXml from '@lucide/svelte/icons/code-xml';
import { NodeViewWrapper } from 'svelte-tiptap';

let open = $state(false);
let iframUrl = $state('');

function handleSubmit(e: Event) {
  e.preventDefault();
  open = false;
  editor.chain().focus().setIframe({ src: iframUrl }).run();
}
</script>

<NodeViewWrapper
	as="div"
	contenteditable="false"
	class={buttonVariants({
		variant: 'secondary',
		class: 'media-placeholder relative my-4! w-full justify-start p-6'
	})}
	style="user-select: none;"
	draggable={true}
	onclick={() => (open = true)}
>
	<CodeXml />
	<span>Insert an iframe</span>
	<Popover.Root bind:open>
		<Popover.Trigger class="sr-only absolute left-1/2">Open</Popover.Trigger>
		<Popover.Content
			onCloseAutoFocus={(e) => e.preventDefault()}
			contenteditable={false}
			class="bg-popover w-96 p-4 transition-all duration-300"
			portalProps={{ disabled: true, to: undefined }}
		>
			<form onsubmit={handleSubmit} class="flex flex-col gap-2">
				<Input placeholder="Embed IFrame" bind:value={iframUrl} required type="url" />
				<Button type="submit" variant="secondary">Insert</Button>
			</form>
		</Popover.Content>
	</Popover.Root>
</NodeViewWrapper>
