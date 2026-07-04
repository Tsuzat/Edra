<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { NodeViewWrapper } from '$lib/edra/tiptap/index.js';
	import { type NodeViewProps } from '@tiptap/core';

	const { editor, node, updateAttributes }: NodeViewProps = $props();
</script>

<NodeViewWrapper>
	<Button></Button>
</NodeViewWrapper>
