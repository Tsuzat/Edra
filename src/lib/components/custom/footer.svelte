<script lang="ts">
	import Button from '../ui/button/button.svelte';
	import Coffee from 'lucide-svelte/icons/coffee';
</script>

<footer
	class="bottom-0 z-50 flex flex-col items-center justify-center gap-2 p-2 sm:flex-row sm:p-4"
>
	<span>
		Made with ❤️ by <a
			href="https://tsuzat.com"
			class="mx-2 text-blue-600 underline"
			target="_blank"
			rel="noopener noreferrer">Tsuzat</a
		>
	</span>
	<Button variant="outline" href="https://buymeacoffee.com/tsuzat" target="_blank">
		<Coffee /> Buy me a coffee
	</Button>
	<img src="https://waka-api.dev-tsuzat.workers.dev/Edra" alt="Waka Api Badge" />
</footer>
