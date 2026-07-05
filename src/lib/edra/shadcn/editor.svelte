<script lang="ts">
	import TiptapContent from '../tiptap/components/TiptapContent.svelte';
	import './editor.css';
	import {
		MathBlock,
		Link,
		MathInline,
		TableColMenu,
		TableRowMenu
	} from './components/menu/index.js';

	interface Props {
		class: string;
	}
	const { class: className = '' }: Props = $props();
</script>

<Link />
<MathBlock />
<MathInline />
<TableColMenu />
<TableRowMenu />
<TiptapContent class={className} />
