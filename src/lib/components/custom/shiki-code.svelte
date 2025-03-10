<script lang="ts">
	import { cn } from '$lib/utils.js';
	import {
		codeToHtml,
		type BundledLanguage,
		type SpecialLanguage,
		type StringLiteralUnion
	} from 'shiki';
	import { onMount } from 'svelte';

	interface Props {
		class?: string;
		code: string;
		lang: StringLiteralUnion<BundledLanguage | SpecialLanguage, string>;
	}

	const { class: className = '', code, lang }: Props = $props();

	let html = $state('');
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
	{@html html}
</div>
