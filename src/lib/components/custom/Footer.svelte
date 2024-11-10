<script lang="ts">
	import Button from '../ui/button/button.svelte';
	import Icons from './icons/index.js';
</script>

<footer class="flex items-center justify-center p-2 sm:p-4">
	Made with ❤️ by <a
		href="https://tsuzat.com"
		class="mx-2 text-blue-600 underline"
		target="_blank"
		rel="noopener noreferrer">Tsuzat</a
	>
	<Button variant="outline" href="https://buymeacoffee.com/tsuzat" target="_blank">
		<Icons.coffee /> Buy me a coffee
	</Button>
</footer>
