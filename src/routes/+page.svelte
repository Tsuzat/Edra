<script lang="ts">
	import { Tiptap } from '$lib/edra/tiptap/index.js';
	import { createEditor } from '$lib/edra/shadcn/index.js';

	const editor = createEditor();
</script>

<div class="border w-3xl mx-auto p-4 rounded-lg min-h-96">
	<Tiptap {editor}>
		<Tiptap.Content class="*:outline-none cursor-auto" />
	</Tiptap>
</div>
