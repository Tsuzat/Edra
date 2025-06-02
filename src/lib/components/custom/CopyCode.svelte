<script lang="ts">
	let isClicked = $state(false);
	let CopyCodeElement: HTMLButtonElement | undefined = $state();

	function copyCode() {
		isClicked = true;
		// Next child element is code so copy that to clipboard
		const code = CopyCodeElement?.parentNode?.nextSibling;
		console.log(code);
		if (code && code.textContent) navigator.clipboard.writeText(code.textContent);

		setTimeout(() => {
			isClicked = false;
		}, 2000);
	}
</script>

<button
	class="text-foreground h-fit p-0 font-medium hover:bg-transparent"
	onclick={copyCode}
	bind:this={CopyCodeElement}
>
	{#if isClicked}
		<span class="text-sm text-green-500">Copied</span>
	{:else}
		<span class="text-sm">Copy</span>
	{/if}
</button>
