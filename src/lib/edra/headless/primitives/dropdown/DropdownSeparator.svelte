<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<div class="dropdown-separator {className}"></div>

<style>
	.dropdown-separator {
		height: 1px;
		background-color: var(--edra-hairline);
		margin-top: 0.25rem;
		margin-bottom: 0.25rem;
	}
</style>
