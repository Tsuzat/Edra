export const usageCode = `<script lang="ts">
	import { ToC, createEditor, Edra } from '$lib/edra/shadcn/index.js';

	const editor = createEditor();
</script>

<div class="flex gap-4">
	<!-- Main Editor Canvas -->
	<div class="flex-1">
		<Edra {editor} />
	</div>

	<!-- Sidebar Table of Contents -->
	<div class="w-64 hidden md:block">
		<div class="sticky top-4">
			<h4 class="font-semibold mb-4">On this page</h4>
			<ToC {editor} />
		</div>
	</div>
</div>`;
