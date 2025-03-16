<script lang="ts">
	import { Button } from '../ui/button/index.js';
	import ArrowUp from 'lucide-svelte/icons/arrow-up';
</script>

<Button
	variant="outline"
	size="icon"
	class="fixed bottom-2 right-2 z-50 rounded-full sm:bottom-4 sm:right-4"
	onclick={() =>
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		})}
	title="Scroll to top"
>
	<ArrowUp />
</Button>
