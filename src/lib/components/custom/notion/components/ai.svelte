<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import EdraToolTip from '$lib/edra/shadcn/components/EdraToolTip.svelte';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import type { Editor } from '@tiptap/core';
	import { toast } from 'svelte-sonner';
	import ArrowDownWideNarrow from 'lucide-svelte/icons/arrow-down-wide-narrow';
	import WrapText from 'lucide-svelte/icons/wrap-text';
	import CheckCheck from 'lucide-svelte/icons/check-check';
	import RefreshCcwDot from 'lucide-svelte/icons/refresh-ccw-dot';

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
		const text = getSelectionText();
		const data = { tool, text };
		toast.promise(
			fetch('/examples/notion/api', {
				method: 'POST',
				body: JSON.stringify(data),
				headers: { 'Content-Type': 'application/json' }
			}),
			{
				loading: 'AI is thinking...',
				success: (response) => {
					console.log(response.json());
					// insertMD(response.json());
					return 'AI changes are done!';
				},
				error: (error) => {
					console.error(error);
					return 'Something went wrong! Check console.';
				}
			}
		);
	}

	const makeTextShorter = () => processText('shorter');
	const makeTextLonger = () => processText('longer');
	const reWriteText = () => processText('re-write');
	const checkGrammer = () => processText('fix-grammar');
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<EdraToolTip content="AI Assistant">
			<Button variant="ghost" class="h-8 w-fit gap-0.5 p-2">
				<span
					class="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text font-bold text-transparent"
					>Ask AI</span
				>
				<ChevronDown class="!size-2 text-muted-foreground" />
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
