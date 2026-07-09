export const usageCode = `<script lang="ts">
	import { createEditor, Edra } from '$lib/edra/shadcn/index.js';

	// Create editor instance
	const editor = createEditor({
		onUpdate: () => {
			console.log(editor?.getHTML());
		}
	});
</script>

<div class="border rounded-lg p-2">
	<Edra {editor}>
		<Edra.Toolbar class="border-b p-1" />
		<Edra.Content class="min-h-60 px-4 py-2" />
	</Edra>
</div>`;
