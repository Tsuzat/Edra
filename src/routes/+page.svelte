<script lang="ts">
	import { createEditor, Edra, type Content } from '$lib/edra/shadcn/index.js';
	import { onMount } from 'svelte';

	const onUpdate = () => {
		localStorage.setItem('edra-content', JSON.stringify(editor?.getJSON()));
	};
	const editor = createEditor({
		onUpdate
	});

	onMount(() => {
		const content = JSON.parse(localStorage.getItem('edra-content') || '[]') as Content;
		editor?.commands.setContent(content, { contentType: 'json' });
	});
	async function callAI(
		prompt: string,
		onChunk: (chunk: string) => void,
		onError: (error: Error) => void
	) {
		try {
			const response = await fetch('/api/ai/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ prompt })
			});

			if (!response.ok) {
				throw new Error(await response.text());
			}

			const reader = response.body?.getReader();
			if (!reader) {
				throw new Error('Response body is not readable');
			}

			const decoder = new TextDecoder();
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				const chunkText = decoder.decode(value, { stream: true });
				onChunk(chunkText);
			}
		} catch (error) {
			onError(error instanceof Error ? error : new Error(String(error)));
		}
	}
</script>

<div class="border w-5xl mx-auto rounded-lg">
	<Edra {editor}>
		<Edra.UseAI {callAI} />
		<Edra.Toolbar class="border-b p-1 overflow-x-scroll max-w-full!" />
		<Edra.Content class="*:outline-none cursor-auto h-120 overflow-y-scroll px-8" />
		<Edra.DragHandle />
	</Edra>
</div>
