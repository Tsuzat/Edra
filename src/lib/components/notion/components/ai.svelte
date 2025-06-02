<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import EdraToolTip from '$lib/edra/shadcn/components/EdraToolTip.svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import type { Editor } from '@tiptap/core';
	import { toast } from 'svelte-sonner';
	import ArrowDownWideNarrow from '@lucide/svelte/icons/arrow-down-wide-narrow';
	import WrapText from '@lucide/svelte/icons/wrap-text';
	import CheckCheck from '@lucide/svelte/icons/check-check';
	import RefreshCcwDot from '@lucide/svelte/icons/refresh-ccw-dot';

	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();

	function getSelectionText(): string {
		const slice = editor.state.selection.content();
		return editor.storage.markdown.serializer.serialize(slice.content);
	}

	function insertMD(text: string) {
		const { from, to } = editor.view.state.selection;

		editor.chain().focus().insertContentAt({ from, to }, text).run();
	}

	async function processText(tool: 'longer' | 'shorter' | 're-write' | 'fix-grammar') {
		const id = toast.loading('AI is thinking...', { duration: 10000 });
		try {
			const text = getSelectionText();
			const data = { tool, text };

			const response = await fetch('/examples/notion/api', {
				method: 'POST',
				body: JSON.stringify(data),
				headers: { 'Content-Type': 'application/json' }
			});
			const { message } = await response.json();
			const status = response.status;
			if (status === 200) {
				insertMD(message);
				toast.success('AI Changes are done!', { id });
			} else {
				toast.error(message, { id });
			}
		} catch (error) {
			console.error(error);
			toast.error('Something went wrong! Check console.', { id });
		}
	}

	const makeTextShorter = () => processText('shorter');
	const makeTextLonger = () => processText('longer');
	const reWriteText = () => processText('re-write');
	const checkGrammer = () => processText('fix-grammar');
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<EdraToolTip tooltip="AI Assistant">
			<Button variant="ghost" class="h-8 w-fit gap-0.5 p-2">
				<span
					class="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text font-bold text-transparent"
					>Ask AI</span
				>
				<ChevronDown class="text-muted-foreground !size-2" />
			</Button>
		</EdraToolTip>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="" portalProps={{ disabled: true, to: undefined }}>
		<DropdownMenu.Item onclick={makeTextShorter}>
			<ArrowDownWideNarrow />
			<span>Make Shorter</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={makeTextLonger}>
			<WrapText />
			<span>Make Longer</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={reWriteText}>
			<RefreshCcwDot />
			<span>Re-Write</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={checkGrammer}>
			<CheckCheck />
			<span>Fix Grammer</span>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
