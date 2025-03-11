<script lang="ts">
	import { cn } from '$lib/utils.js';
	import {
		codeToHtml,
		type BundledLanguage,
		type SpecialLanguage,
		type StringLiteralUnion
	} from 'shiki';
	import { onMount } from 'svelte';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	interface Props {
		class?: string;
		code: string;
		lang: StringLiteralUnion<BundledLanguage | SpecialLanguage, string>;
	}

	const { class: className = '', code, lang }: Props = $props();

	let html: string | undefined = $state(undefined);
	onMount(async () => {
		html = await codeToHtml(code, {
			lang,
			themes: {
				light: 'github-light-high-contrast',
				dark: 'github-dark-high-contrast'
			}
		});
	});
</script>

<div class={cn('relative rounded border border-border/50 py-4', className)}>
	{#if html === undefined}
		<div class="flex size-full items-center justify-center gap-4">
			<LoaderCircle class="animate-spin" /> <span> Loading... </span>
		</div>
	{:else}
		{@html html}
	{/if}
</div>
