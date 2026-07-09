<script lang="ts">
	import { setTabs } from './context.ts';
	import type { Snippet } from 'svelte';

	interface Props {
		value?: string;
		onValueChange?: (val: string) => void;
		class?: string;
		children: Snippet<[]>;
	}

	let { value = $bindable(''), onValueChange, class: className = '', children }: Props = $props();

	const context = {
		get value() {
			return value;
		},
		setValue(val: string) {
			value = val;
			onValueChange?.(val);
		}
	};

	setTabs(context);
</script>

<div class="tabs-root {className}">
	{@render children()}
</div>

<style>
	.tabs-root {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
</style>
