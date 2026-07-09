<script lang="ts">
	interface Props {
		code: string;
		language: BundledLanguage;
	}
	const { code, language }: Props = $props();

	import { highlighter } from '$lib/components/highlighter.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Copy } from '@lucide/svelte';
	import type { BundledLanguage } from 'shiki';
	import { onMount } from 'svelte';
	import Tooltip from '../Tooltip.svelte';

	let highlightedCode = $state('');
	let ref = $state<HTMLDivElement | null>(null);

	onMount(() => {
		highlightedCode = highlighter.codeToHtml(code, {
			lang: language,
			themes: {
				dark: 'github-dark',
				light: 'github-light'
			}
		});
	});

	function copy() {
		const text = ref?.children[1].textContent ?? '';
		navigator.clipboard.writeText(text);
	}
</script>

<div bind:this={ref} class="relative rounded-lg p-2 bg-muted shadow-2xl dark:bg-muted/30">
	<Tooltip class="absolute right-2 top-2" tooltip="Copy Code">
		<Button variant="ghost" size="icon" onclick={copy}>
			<Copy />
		</Button>
	</Tooltip>
	{@html highlightedCode}
</div>
