<script lang="ts">
	import { createEditor, Edra, type Content } from '$lib/edra/shadcn/index.js';
	import { onMount } from 'svelte';

	const editor = createEditor();

	editor?.on('update', () => {
		localStorage.setItem('edra-content', JSON.stringify(editor.getJSON()));
	});

	onMount(() => {
		const content = JSON.parse(localStorage.getItem('edra-content') || '[]') as Content;
		editor?.commands.setContent(content, { contentType: 'json' });
	});
</script>

<div class="border w-3xl mx-auto p-4 rounded-lg min-h-96">
	<Edra {editor}>
		<Edra.Content class="*:outline-none cursor-auto" />
	</Edra>
</div>
