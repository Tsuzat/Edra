<script lang="ts">
	import { Redo } from 'lucide-svelte';
	import { type Editor } from '@tiptap/core';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let { editor }: { editor: Editor } = $props();
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Button
				variant="ghost"
				class="size-8"
				onclick={() => editor.chain().focus().redo().run()}
				disabled={!editor.can().chain().focus().redo().run()}
			>
				<Redo />
			</Button>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Redo (⌘R)</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
