<script lang="ts">
	import { setContext } from 'svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet<[]>;
	}

	let { children }: Props = $props();

	let open = $state(false);
	let triggerEl = $state<HTMLElement | null>(null);
	let contentEl = $state<HTMLElement | null>(null);

	const subContext = {
		get open() {
			return open;
		},
		set open(val) {
			open = val;
		},
		get triggerEl() {
			return triggerEl;
		},
		set triggerEl(val) {
			triggerEl = val;
		},
		get contentEl() {
			return contentEl;
		},
		set contentEl(val) {
			contentEl = val;
		}
	};

	setContext('edra-dropdown-sub', subContext);
</script>

<div class="dropdown-sub">
	{@render children()}
</div>

<style>
	.dropdown-sub {
		position: relative;
	}
</style>
