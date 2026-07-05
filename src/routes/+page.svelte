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
</script>

<div class="border w-5xl mx-auto rounded-lg">
	<Edra {editor}>
		<Edra.DragHandle />
		<Edra.Toolbar class="border-b p-1 overflow-x-scroll max-w-full!" />
		<Edra.Content class="*:outline-none cursor-auto h-96 overflow-y-scroll px-8" />
	</Edra>
</div>
