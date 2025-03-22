<script lang="ts">
	import { type Editor } from '@tiptap/core';
	import { onDestroy, onMount } from 'svelte';

	import { initiateEditor } from '../editor.js';
	import './style.css';
	import 'katex/dist/katex.min.css';

	// Lowlight
	import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
	import { all, createLowlight } from 'lowlight';
	import '../editor.css';
	import '../onedark.css';
	import { SvelteNodeViewRenderer } from 'svelte-tiptap';
	import CodeExtended from './components/CodeExtended.svelte';
	import { AudioPlaceHolder } from '../extensions/audio/AudioPlaceholder.js';
	import AudioPlaceHolderComponent from './components/AudioPlaceHolder.svelte';
	import AudioExtendedComponent from './components/AudioExtended.svelte';
	import { ImagePlaceHolder } from '../extensions/image/ImagePlaceHolder.js';
	import ImagePlaceHolderComponent from './components/ImagePlaceHolder.svelte';
	import { VideoPlaceHolder } from '../extensions/video/VideoPlaceHolder.js';
	import VideoPlaceHolderComponent from './components/VideoPlaceHolder.svelte';
	import { ImageExtended } from '../extensions/image/ImageExtended.js';
	import ImageExtendedComponent from './components/ImageExtended.svelte';
	import VideoExtendedComponent from './components/VideoExtended.svelte';
	import { VideoExtended } from '../extensions/video/VideoExtended.js';
	import { AudioExtended } from '../extensions/audio/AudiExtended.js';
	import LinkMenu from './menus/link-menu.svelte';
	import TableRowMenu from './menus/table/table-row-menu.svelte';
	import TableColMenu from './menus/table/table-col-menu.svelte';
	import slashcommand from '../extensions/slash-command/slashcommand.js';
	import SlashCommandList from './components/SlashCommandList.svelte';
	import BubbleMenu from './menus/bubble-menu.svelte';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import type { EdraProps } from '../utils.js';
	import DragHandle from '../drag-handle.svelte';
	import IFramePlaceholderComponent from './components/IFramePlaceholder.svelte';
	import { IFramePlaceHolder } from '../extensions/iframe/IFramePlaceHolder.js';
	import { IFrameExtended } from '../extensions/iframe/IFrameExtended.js';
	import IFrameExtendedComponent from './components/IFrameExtended.svelte';

	const lowlight = createLowlight(all);

	let {
		class: className = '',
		content = undefined,
		showBubbleMenu = true,
		allowedBubbleMenuCommands = [],
		showSlashCommands = true,
		limit = undefined,
		editable = true,
		editor = $bindable<Editor | undefined>(),
		onUpdate
	}: EdraProps = $props();

	let element = $state<HTMLElement>();

	onMount(() => {
		editor = initiateEditor(
			element,
			content,
			limit,
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
				IFramePlaceHolder(IFramePlaceholderComponent),
				IFrameExtended(IFrameExtendedComponent),
				VideoPlaceHolder(VideoPlaceHolderComponent),
				AudioExtended(AudioExtendedComponent),
				ImageExtended(ImageExtendedComponent),
				VideoExtended(VideoExtendedComponent),
				...(showSlashCommands ? [slashcommand(SlashCommandList)] : [])
			],
			{
				editable,
				onUpdate,
				onTransaction: (props) => {
					editor = undefined;
					editor = props.editor;
				}
			}
		);
	});

	onDestroy(() => {
		editor?.destroy();
	});

	// Sets focus on the editor and moves the cursor to the clicked text position,
	// defaulting to the end of the document if the click is outside any text.
	function focusEditor(event?: MouseEvent | KeyboardEvent) {
		if (!editor) return;

		// Check if there is a text selection already (i.e. a non-empty selection)
		const selection = window.getSelection();
		if (selection && selection.toString().length > 0) {
			// Just focus the editor without modifying the selection
			editor.chain().focus().run();
			return;
		}

		if (event instanceof MouseEvent) {
			const { clientX, clientY } = event;
			const pos = editor.view.posAtCoords({ left: clientX, top: clientY })?.pos;
			if (pos == null) {
				// If not a valid position, move cursor to the end of the document
				const endPos = editor.state.doc.content.size;
				editor.chain().focus().setTextSelection(endPos).run();
			} else {
				editor.chain().focus().setTextSelection(pos).run();
			}
		} else {
			editor.chain().focus().run();
		}
	}
</script>

{#if editor}
	<DragHandle {editor} />
{/if}

<div class={`edra ${className}`}>
	{#if editor && showBubbleMenu}
		<LinkMenu {editor} />
		<TableRowMenu {editor} />
		<TableColMenu {editor} />
		<BubbleMenu {editor} {allowedBubbleMenuCommands} />
	{/if}
	{#if !editor}
		<div class="edra-loading">
			<LoaderCircle class="animate-spin" /> Loading...
		</div>
	{/if}
	<div
		bind:this={element}
		role="button"
		tabindex="0"
		onclick={focusEditor}
		onkeydown={(event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				focusEditor(event);
			}
		}}
		class="edra-editor"
	></div>
</div>

<style>
	:global(.ProseMirror) {
		min-height: 100%;
		position: relative;
		word-wrap: break-word;
		white-space: pre-wrap;
		cursor: auto;
		-webkit-font-variant-ligatures: none;
		font-variant-ligatures: none;
		&:focus {
			outline: none;
		}
	}
</style>
