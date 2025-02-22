<script lang="ts">
	import './editor.css';

	import { Editor, type Content } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import { onDestroy, onMount } from 'svelte';
	import EditorToolbar from './editor-toolbar.svelte';
	import { cn } from '$lib/utils.js';

	import { Subscript } from '@tiptap/extension-subscript';
	import { Superscript } from '@tiptap/extension-superscript';
	import { Underline } from '@tiptap/extension-underline';
	import { Link } from '@tiptap/extension-link';
	import TaskList from '@tiptap/extension-task-list';
	import TaskItem from '@tiptap/extension-task-item';
	import TextStyle from '@tiptap/extension-text-style';
	import Color from '@tiptap/extension-color';
	import Highlight from '@tiptap/extension-highlight';
	import Text from '@tiptap/extension-text';
	import Typography from '@tiptap/extension-typography';
	import TextAlign from '@tiptap/extension-text-align';
	import Gapcursor from '@tiptap/extension-gapcursor';
	import { MathExtension } from '@aarkue/tiptap-math-extension';
	import { Markdown } from 'tiptap-markdown';

	import 'katex/dist/katex.min.css';

	import { SmilieReplacer } from './custom/Extentions/SmilieReplacer.js';
	import { ColorHighlighter } from './custom/Extentions/ColorHighlighter.js';
	import { ImageExtension } from './custom/Extentions/ImageExtention.js';
	import { SvelteNodeViewRenderer } from 'svelte-tiptap';
	import CodeExtended from './custom/code-extended.svelte';

	// Lowlight
	import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
	import { all, createLowlight } from 'lowlight';
	import './onedark.css';
	import SearchAndReplace from './custom/Extentions/SearchAndReplace.js';
	import { ImagePlaceholder } from './custom/Extentions/ImagePlaceHolder.js';
	import Placeholder from '@tiptap/extension-placeholder';
	import AutoJoiner from 'tiptap-extension-auto-joiner';
	import GlobalDragHandle from 'tiptap-extension-global-drag-handle';
	import { VideoExtention } from './custom/Extentions/VideoExtended.js';
	import { VideoPlaceholder } from './custom/Extentions/VideoPlaceHolder.js';
	import LinkBubbleMenu from './menus/link-bubble-menu.svelte';
	import { Table, TableCell, TableHeader, TableRow } from './custom/Extentions/table/index.js';
	import TableColumnMenu from './custom/Extentions/table/menu/table-col-menu.svelte';
	import TableRowMenu from './custom/Extentions/table/menu/table-row-menu.svelte';
	import { getHandlePaste } from './custom/utils.js';
	import SlashCommand from './custom/Extentions/slash-command/slashcommand.js';
	import FontSize from './custom/Extentions/FontSize.js';
	import { AudioPlaceholder } from './custom/Extentions/AudioPlaceHolder.js';
	import { AudioExtention } from './custom/Extentions/AudioExtended.js';

	const lowlight = createLowlight(all);

	interface Props {
		class?: string;
		content?: Content;
		showToolbar?: boolean;
	}

	let { class: className = '', content = $bindable(''), showToolbar = true }: Props = $props();

	let editor = $state<Editor>();
	let element = $state<HTMLElement>();

	onMount(() => {
		editor = new Editor({
			element,
			content,
			editorProps: {
				attributes: {
					class:
						'm-auto p-2 px-6 focus:outline-none flex-1 prose text-foreground min-w-full max-h-full overflow-auto dark:prose-invert *:my-2'
				}
			},
			extensions: [
				StarterKit.configure({
					orderedList: {
						HTMLAttributes: {
							class: 'list-decimal'
						}
					},
					bulletList: {
						HTMLAttributes: {
							class: 'list-disc'
						}
					},
					heading: {
						levels: [1, 2, 3, 4],
						HTMLAttributes: {
							class: 'tiptap-heading'
						}
					},
					codeBlock: false,
					text: false
				}),
				Placeholder.configure({
					emptyEditorClass: 'is-empty',
					// Use a placeholder:
					// Use different placeholders depending on the node type:
					placeholder: ({ node }) => {
						if (node.type.name === 'heading') {
							return 'What’s the title?';
						} else if (node.type.name === 'paragraph') {
							return 'Press / or write something ...';
						}
						return '';
					}
				}),
				AutoJoiner,
				GlobalDragHandle.configure({
					excludedTags: ['pre', 'code', 'table p']
				}),
				Typography,
				Text,
				TextStyle,
				TextAlign.configure({
					types: ['heading', 'paragraph']
				}),
				Color,
				Highlight.configure({ multicolor: true }),
				Underline,
				Superscript,
				Subscript,
				Link.configure({
					openOnClick: false,
					autolink: true,
					defaultProtocol: 'https',
					HTMLAttributes: {
						target: '_blank',
						rel: 'noopener noreferrer'
					}
				}),
				TaskList,
				TaskItem.configure({
					nested: true
				}),
				SearchAndReplace,
				CodeBlockLowlight.configure({
					lowlight
				}).extend({
					addNodeView() {
						return SvelteNodeViewRenderer(CodeExtended);
					}
				}),
				SmilieReplacer,
				ColorHighlighter,
				Table,
				TableCell,
				TableRow,
				TableHeader,
				ImageExtension.configure({
					allowBase64: true
				}),
				ImagePlaceholder,
				MathExtension.configure({ evaluation: true }),
				Markdown,
				VideoExtention,
				VideoPlaceholder,
				SlashCommand,
				FontSize,
				AudioPlaceholder,
				AudioExtention
			],
			autofocus: true,
			onUpdate: (transaction) => {
				content = transaction.editor.getJSON();
			},
			onTransaction: (transaction) => {
				editor = undefined;
				editor = transaction.editor;
			}
		});

		editor.setOptions({
			editorProps: {
				handlePaste: getHandlePaste(editor)
			}
		});
	});

	onDestroy(() => {
		if (editor) editor.destroy();
	});
</script>

<div class={cn('flex flex-col rounded border', className)}>
	{#if editor && showToolbar}
		{#if showToolbar}
			<EditorToolbar {editor} />
		{/if}
		<LinkBubbleMenu {editor} />
		<TableColumnMenu {editor} />
		<TableRowMenu {editor} />
	{/if}
	<div bind:this={element} spellcheck="false" class="h-full w-full flex-1 overflow-auto"></div>
</div>
