<script lang="ts">
	import TiptapContent from '../tiptap/components/TiptapContent.svelte';
	import './editor.css';
	import mermaid from 'mermaid';
	import {
		MathBlock,
		Link,
		MathInline,
		TableColMenu,
		TableRowMenu
	} from './components/menu/index.js';
	import { mode } from 'mode-watcher';
	import { cn } from '$lib/utils.js';

	interface Props {
		class?: string;
	}
	const { class: className = '' }: Props = $props();

	mermaid.initialize({
		startOnLoad: false,
		theme: mode.current === 'dark' ? 'dark' : 'default',
		securityLevel: 'loose',
		fontFamily: 'inherit'
	});
</script>

<Link />
<MathBlock />
<MathInline />
<TableColMenu />
<TableRowMenu />
<TiptapContent class={cn('relative', className)} />
