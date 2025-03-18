<script lang="ts">
	import { X } from 'lucide-svelte';
	import { Button } from '../ui/button/index.js';
	import { slide } from 'svelte/transition';

	let show = $state(true);
</script>

{#if show}
	<div
		transition:slide
		class="top-0 flex h-fit w-full items-center justify-center gap-4 border-b bg-red-700 p-2 !text-white"
	>
		<div>
			ShadEditor is evolving to be <a href="https://edra.tsuzat.com" class="underline">Edra</a>.
		</div>
		<Button variant="ghost" class="size-6 rounded-sm p-0" onclick={() => (show = false)}>
			<X />
		</Button>
	</div>
{/if}
