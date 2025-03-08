<script lang="ts">
	import type { Content, Editor } from '@tiptap/core';
	import { onMount } from 'svelte';
	import { initiateEditor } from '../editor.js';
	import { Transaction } from '@tiptap/pm/state';
	import Toolbar from './toolbar.svelte';

	import '../editor.css';
	import './style.css';
	import '../onedark.css';

	import 'katex/dist/katex.min.css';
	import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
	import CodeExtended from './components/CodeExtended.svelte';
	import { all, createLowlight } from 'lowlight';
	import { SvelteNodeViewRenderer } from 'svelte-tiptap';
	import { ImagePlaceHolder } from '../extensions/image/ImagePlaceHolder.js';
	import ImagePlaceHolderComponent from './components/ImagePlaceHolder.svelte';
	import { AudioPlaceHolder } from '../extensions/audio/AudioPlaceholder.js';
	import AudioPlaceHolderComponent from './components/AudioPlaceHolder.svelte';
	import { VideoPlaceHolder } from '../extensions/video/VideoPlaceHolder.js';
	import VideoPlaceHolderComponent from './components/VideoPlaceHolder.svelte';
	import { ImageExtended } from '../extensions/image/ImageExtended.js';
	import { VideoExtended } from '../extensions/video/VideoExtended.js';
	import { AudioExtended } from '../extensions/audio/AudiExtended.js';
	import ImageExtendedComponent from './components/ImageExtended.svelte';
	import VideoExtendedComponent from './components/VideoExtended.svelte';
	import AudioExtendedComponent from './components/AudioExtended.svelte';
	import LinkMenu from './menus/link-menu.svelte';
	import TableColMenu from './menus/table-col-menu.svelte';
	import TableRowMenu from './menus/table-row-menu.svelte';
	import slashcommand from '../extensions/slash-command/slashcommand.js';
	import SlashCommandList from './components/SlashCommandList.svelte';

	const lowlight = createLowlight(all);

	interface Props {
		class?: string;
		content?: Content;
		editable?: boolean;
		editor?: Editor;
		/**
		 * Callback function to be called when the content is updated
		 * @param content
		 */
		onUpdate?: (props: { editor: Editor; transaction: Transaction }) => void;
	}

	let {
		class: className = '',
		content = $bindable(),
		editable = true,
		editor = $bindable<Editor | undefined>(),
		onUpdate
	}: Props = $props();

	let element = $state<HTMLElement>();

	onMount(() => {
		editor = initiateEditor(
			element,
			content,
			[
				CodeBlockLowlight.configure({
					lowlight
				}).extend({
					addNodeView() {
						return SvelteNodeViewRenderer(CodeExtended);
					}
				}),
				AudioPlaceHolder(AudioPlaceHolderComponent),
				ImagePlaceHolder(ImagePlaceHolderComponent),
				VideoPlaceHolder(VideoPlaceHolderComponent),
				ImageExtended(ImageExtendedComponent),
				VideoExtended(VideoExtendedComponent),
				AudioExtended(AudioExtendedComponent),
				slashcommand(SlashCommandList)
			],
			{
				editable,
				onUpdate,
				onTransaction(props) {
					editor = undefined;
					editor = props.editor;
				}
			}
		);
	});
</script>

<div class={`edra ${className} flex flex-col`}>
	{#if editor}
		<div>
			<Toolbar {editor} />
			<LinkMenu {editor} />
			<TableColMenu {editor} />
			<TableRowMenu {editor} />
		</div>
	{/if}
	<div
		bind:this={element}
		class="edra-editor prose size-full min-w-full flex-grow overflow-auto py-2 pl-10 pr-8 dark:prose-invert *:outline-none"
	></div>
</div>
