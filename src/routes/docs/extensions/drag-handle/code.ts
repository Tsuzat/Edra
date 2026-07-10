export const setUpCode = `<script lang="ts">
	import { createEditor, Edra } from '$lib/edra/shadcn/index.js';

	const editor = createEditor();
</script>

<div class="border rounded-lg">
	<Edra {editor}>
		<!-- Add the DragHandle markup inside the Edra container -->
		<Edra.DragHandle />
		
		<Edra.Content />
	</Edra>
</div>`;
