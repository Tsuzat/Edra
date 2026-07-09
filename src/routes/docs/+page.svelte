<script lang="ts">
	import AppSidebar from '$lib/components/custom/AppSidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<div class="flex flex-1 flex-col">
			<div class="@container/main flex flex-1 flex-col gap-2"></div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
