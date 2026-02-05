import AlignCenter from '@lucide/svelte/icons/align-center';
import AlighJustify from '@lucide/svelte/icons/align-justify';
import AlignLeft from '@lucide/svelte/icons/align-left';
import AlignRight from '@lucide/svelte/icons/align-right';
import Audio from '@lucide/svelte/icons/audio-lines';
import Bold from '@lucide/svelte/icons/bold';
import Code from '@lucide/svelte/icons/code';
import IFrame from '@lucide/svelte/icons/code-xml';
import Heading1 from '@lucide/svelte/icons/heading-1';
import Heading2 from '@lucide/svelte/icons/heading-2';
import Heading3 from '@lucide/svelte/icons/heading-3';
import Heading4 from '@lucide/svelte/icons/heading-4';
import Image from '@lucide/svelte/icons/image';
import Italic from '@lucide/svelte/icons/italic';
import Link from '@lucide/svelte/icons/link-2';
import List from '@lucide/svelte/icons/list';
import ListChecks from '@lucide/svelte/icons/list-checks';
import ListOrdered from '@lucide/svelte/icons/list-ordered';
import Pilcrow from '@lucide/svelte/icons/pilcrow';
import Quote from '@lucide/svelte/icons/quote';
import Radical from '@lucide/svelte/icons/radical';
import Redo from '@lucide/svelte/icons/redo-2';
import SquareRadical from '@lucide/svelte/icons/square-radical';
import StrikeThrough from '@lucide/svelte/icons/strikethrough';
import Subscript from '@lucide/svelte/icons/subscript';
import Superscript from '@lucide/svelte/icons/superscript';
import Table from '@lucide/svelte/icons/table';
import Underline from '@lucide/svelte/icons/underline';
import Undo from '@lucide/svelte/icons/undo-2';
import Video from '@lucide/svelte/icons/video';
import { isTextSelection } from '@tiptap/core';
import { isMac } from '../utils.js';
import type { EdraToolBarCommands } from './types.js';
import strings from '../strings.js';

const commands: Record<string, EdraToolBarCommands[]> = {
	'undo-redo': [
		{
			icon: Undo,
			name: 'undo',
			tooltip: strings.command.undo,
			shortCut: `${isMac ? '⌘' : 'Ctrl+'}Z`,
			onClick: (editor) => {
				editor.chain().focus().undo().run();
			},
			clickable: (editor) => {
				return editor.can().undo();
			}
		},
		{
			icon: Redo,
			name: 'redo',
			tooltip: strings.command.redo,
			shortCut: `${isMac ? '⌘' : 'Ctrl+'}Y`,
			onClick: (editor) => {
				editor.chain().focus().redo().run();
			},
			clickable: (editor) => {
				return editor.can().redo();
			}
		}
	],
	headings: [
		{
			icon: Heading1,
			name: 'h1',
			tooltip: strings.command.h1,
			shortCut: `${isMac ? '⌘⌥' : 'Ctrl+Alt+'}1`,
			onClick: (editor) => {
				editor.chain().focus().toggleHeading({ level: 1 }).run();
			},
			turnInto: (editor, node, pos) => {
				editor.chain().setNodeSelection(pos).setHeading({ level: 1 }).run();
			},
			clickable: (editor) => {
				return editor.can().toggleHeading({ level: 1 });
			},
			isActive: (editor) => {
				return editor.isActive('heading', { level: 1 });
			}
		},
		{
			icon: Heading2,
			name: 'h2',
			tooltip: strings.command.h2,
			shortCut: `${isMac ? '⌘⌥' : 'Ctrl+Alt+'}2`,
			onClick: (editor) => {
				editor.chain().focus().toggleHeading({ level: 2 }).run();
			},
			turnInto: (editor, node, pos) => {
				editor.chain().setNodeSelection(pos).setHeading({ level: 2 }).run();
			},
			clickable: (editor) => {
				return editor.can().toggleHeading({ level: 2 });
			},
			isActive: (editor) => {
				return editor.isActive('heading', { level: 2 });
			}
		},
		{
			icon: Heading3,
			name: 'h3',
			tooltip: strings.command.h3,
			shortCut: `${isMac ? '⌘⌥' : 'Ctrl+Alt+'}3`,
			onClick: (editor) => {
				editor.chain().focus().toggleHeading({ level: 3 }).run();
			},
			turnInto: (editor, node, pos) => {
				editor.chain().setNodeSelection(pos).setHeading({ level: 3 }).run();
			},
			clickable: (editor) => {
				return editor.can().toggleHeading({ level: 3 });
			},
			isActive: (editor) => {
				return editor.isActive('heading', { level: 3 });
			}
		},
		{
			icon: Heading4,
			name: 'h4',
			tooltip: strings.command.h4,
			shortCut: `${isMac ? '⌘⌥' : 'Ctrl+Alt+'}4`,
			onClick: (editor) => {
				editor.chain().focus().toggleHeading({ level: 4 }).run();
			},
			turnInto: (editor, node, pos) => {
				editor.chain().setNodeSelection(pos).setHeading({ level: 4 }).run();
			},
			clickable: (editor) => {
				return editor.can().toggleHeading({ level: 4 });
			},
			isActive: (editor) => {
				return editor.isActive('heading', { level: 4 });
			}
		}
	],
	'text-formatting': [
		{
			icon: Link,
			name: 'link',
			tooltip: strings.command.link,
			onClick: (editor) => {
				if (editor.isActive('link')) {
					editor.chain().focus().unsetLink().run();
				} else {
					const url = window.prompt('Enter the URL of the link:');
					if (url) {
						editor.chain().focus().toggleLink({ href: url }).run();
					}
				}
			},
			isActive: (editor) => {
				return editor.isActive('link');
			}
		},
		{
			icon: Pilcrow,
			name: 'paragraph',
			tooltip: 'Paragraph',
			shortCut: `${isMac ? '⌘⇧' : 'Ctrl+Shift+'}0`,
			onClick: (editor) => {
				editor.chain().focus().setParagraph().run();
			},
			turnInto: (editor, node, pos) => {
				editor.chain().setNodeSelection(pos).setParagraph().run();
			},
			clickable: (editor) => {
				return editor.can().setParagraph();
			},
			isActive: (editor) => {
				return editor.isActive('paragraph');
			}
		},
		{
			icon: Bold,
			name: 'bold',
			tooltip: strings.command.bold,
			shortCut: `${isMac ? '⌘' : 'Ctrl+'}B`,
			onClick: (editor) => {
				editor.chain().focus().toggleBold().run();
			},
			turnInto: (editor, node, pos) => {
				editor.chain().setNodeSelection(pos).setMark('bold').run();
			},
			clickable: (editor) => {
				return editor.can().toggleBold();
			},
			isActive: (editor) => {
				return editor.isActive('bold');
			}
		},
		{
			icon: Italic,
			name: 'italic',
			tooltip: strings.command.italic,
			shortCut: `${isMac ? '⌘' : 'Ctrl+'}I`,
			onClick: (editor) => {
				editor.chain().focus().toggleItalic().run();
			},
			turnInto: (editor, node, pos) => {
				editor.chain().setNodeSelection(pos).setMark('italic').run();
			},
			clickable: (editor) => {
				return editor.can().toggleItalic();
			},
			isActive: (editor) => {
				return editor.isActive('italic');
			}
		},
		{
			icon: Underline,
			name: 'underline',
			tooltip: strings.command.underline,
			shortCut: `${isMac ? '⌘' : 'Ctrl+'}U`,
			onClick: (editor) => {
				editor.chain().focus().toggleUnderline().run();
			},
			turnInto: (editor, node, pos) => {
				editor.chain().setNodeSelection(pos).setMark('underline').run();
			},
			clickable: (editor) => {
				return editor.can().toggleUnderline();
			},
			isActive: (editor) => {
				return editor.isActive('underline');
			}
		},
		{
			icon: StrikeThrough,
			name: 'strikethrough',
			tooltip: strings.command.strikethrough,
			shortCut: `${isMac ? '⌘⇧' : 'Ctrl+Shift+'}S`,
			onClick: (editor) => {
				editor.chain().focus().toggleStrike().run();
			},
			turnInto: (editor, node, pos) => {
				editor.chain().setNodeSelection(pos).setMark('strike').run();
			},
			clickable: (editor) => {
				return editor.can().toggleStrike();
			},
			isActive: (editor) => {
				return editor.isActive('strike');
			}
		},
		{
			icon: Quote,
			name: 'blockQuote',
			tooltip: strings.command.blockQuote,
			shortCut: `${isMac ? '⌘⇧' : 'Ctrl+Shift+'}B`,
			onClick: (editor) => {
				editor.chain().focus().toggleBlockquote().run();
			},
			turnInto: (editor, node, pos) => {
				editor.chain().setNodeSelection(pos).toggleBlockquote().run();
			},
			clickable: (editor) => {
				return editor.can().toggleBlockquote();
			},
			isActive: (editor) => {
				return editor.isActive('blockquote');
			}
		},
		{
			icon: Code,
			name: 'code',
			tooltip: strings.command.code,
			shortCut: `${isMac ? '⌘' : 'Ctrl+'}E`,
			onClick: (editor) => {
				editor.chain().focus().toggleCode().run();
			},
			turnInto: (editor, node, pos) => {
				editor.chain().setNodeSelection(pos).toggleCodeBlock().run();
			},
			clickable: (editor) => {
				return editor.can().toggleCode();
			},
			isActive: (editor) => {
				return editor.isActive('code');
			}
		},
		{
			icon: Superscript,
			name: 'superscript',
			tooltip: strings.command.superscript,
			shortCut: `${isMac ? '⌘' : 'Ctrl+'}.`,
			onClick: (editor) => {
				editor.chain().focus().toggleSuperscript().run();
			},
			clickable: (editor) => {
				return editor.can().toggleSuperscript();
			},
			isActive: (editor) => {
				return editor.isActive('superscript');
			}
		},
		{
			icon: Subscript,
			name: 'subscript',
			tooltip: strings.command.subscript,
			shortCut: `${isMac ? '⌘' : 'Ctrl+'},`,
			onClick: (editor) => {
				editor.chain().focus().toggleSubscript().run();
			},
			clickable: (editor) => {
				return editor.can().toggleSubscript();
			},
			isActive: (editor) => {
				return editor.isActive('subscript');
			}
		}
	],
	alignment: [
		{
			icon: AlignLeft,
			name: 'align-left',
			tooltip: strings.command.alignLeft,
			shortCut: `${isMac ? '⌘⇧' : 'Ctrl+Shift+'}L`,
			onClick: (editor) => {
				editor.chain().focus().toggleTextAlign('left').run();
			},
			turnInto: (editor, node, pos) => {
				editor.chain().setNodeSelection(pos).toggleTextAlign('left').run();
			},
			clickable: (editor) => {
				return editor.can().toggleTextAlign('left');
			},
			isActive: (editor) => editor.isActive({ textAlign: 'left' })
		},
		{
			icon: AlignCenter,
			name: 'align-center',
			tooltip: strings.command.alignCenter,
			shortCut: `${isMac ? '⌘⇧' : 'Ctrl+Shift+'}E`,
			onClick: (editor) => {
				editor.chain().focus().toggleTextAlign('center').run();
			},
			turnInto: (editor, node, pos) => {
				editor.chain().setNodeSelection(pos).toggleTextAlign('center').run();
			},
			clickable: (editor) => {
				return editor.can().toggleTextAlign('center');
			},
			isActive: (editor) => editor.isActive({ textAlign: 'center' })
		},
		{
			icon: AlignRight,
			name: 'align-right',
			tooltip: strings.command.alignRight,
			shortCut: `${isMac ? '⌘⇧' : 'Ctrl+Shift+'}R`,
			onClick: (editor) => {
				editor.chain().focus().toggleTextAlign('right').run();
			},
			turnInto: (editor, node, pos) => {
				editor.chain().setNodeSelection(pos).toggleTextAlign('right').run();
			},
			clickable: (editor) => {
				return editor.can().toggleTextAlign('right');
			},
			isActive: (editor) => editor.isActive({ textAlign: 'right' })
		},
		{
			icon: AlighJustify,
			name: 'align-justify',
			tooltip: strings.command.alignJustify,
			shortCut: `${isMac ? '⌘⇧' : 'Ctrl+Shift+'}J`,
			onClick: (editor) => {
				editor.chain().focus().toggleTextAlign('justify').run();
			},
			turnInto: (editor, node, pos) => {
				editor.chain().setNodeSelection(pos).toggleTextAlign('justify').run();
			},
			clickable: (editor) => {
				return editor.can().toggleTextAlign('justify');
			},
			isActive: (editor) => editor.isActive({ textAlign: 'justify' })
		}
	],
	lists: [
		{
			icon: List,
			name: 'bulletList',
			tooltip: strings.command.bulletList,
			shortCut: `${isMac ? '⌘⇧' : 'Ctrl+Shift+'}8`,
			onClick: (editor) => {
				editor.chain().focus().toggleBulletList().run();
			},
			turnInto: (editor, node, pos) => {
				editor.chain().setNodeSelection(pos).toggleBulletList().run();
			},
			isActive: (editor) => editor.isActive('bulletList')
		},
		{
			icon: ListOrdered,
			name: 'orderedList',
			tooltip: strings.command.orderedList,
			shortCut: `${isMac ? '⌘⇧' : 'Ctrl+Shift+'}7`,
			onClick: (editor) => {
				editor.chain().focus().toggleOrderedList().run();
			},
			turnInto: (editor, node, pos) => {
				editor.chain().setNodeSelection(pos).toggleOrderedList().run();
			},
			clickable: (editor) => {
				return editor.can().toggleOrderedList();
			},
			isActive: (editor) => {
				return editor.isActive('orderedList');
			}
		},
		{
			icon: ListChecks,
			name: 'taskList',
			tooltip: strings.command.taskList,
			shortCut: `${isMac ? '⌘⇧' : 'Ctrl+Shift+'}9`,
			onClick: (editor) => {
				editor.chain().focus().toggleTaskList().run();
			},
			turnInto: (editor, node, pos) => {
				editor.chain().setNodeSelection(pos).toggleTaskList().run();
			},
			clickable: (editor) => {
				return editor.can().toggleTaskList();
			},
			isActive: (editor) => {
				return editor.isActive('taskList');
			}
		}
	],
	media: [
		{
			icon: Image,
			name: 'image-placeholder',
			tooltip: strings.command.imagePlaceholder,
			onClick: (editor) => {
				editor.chain().focus().insertImagePlaceholder().run();
			},
			isActive: (editor) => editor.isActive('image-placeholder')
		},
		{
			icon: Video,
			name: 'video-placeholder',
			tooltip: strings.command.videoPlaceholder,
			onClick: (editor) => {
				editor.chain().focus().insertVideoPlaceholder().run();
			},
			isActive: (editor) => editor.isActive('video-placeholder')
		},
		{
			icon: Audio,
			name: 'audio-placeholder',
			tooltip: strings.command.audioPlaceholder,
			onClick: (editor) => {
				editor.chain().focus().insertAudioPlaceholder().run();
			},
			isActive: (editor) => editor.isActive('audio-placeholder')
		},
		{
			icon: IFrame,
			name: 'iframe-placeholder',
			tooltip: strings.command.iframePlaceholder,
			onClick: (editor) => {
				editor.chain().focus().insertIFramePlaceholder().run();
			},
			isActive: (editor) => editor.isActive('iframe-placeholder')
		}
	],
	table: [
		{
			icon: Table,
			name: 'table',
			tooltip: strings.command.table,
			onClick: (editor) => {
				if (editor.isActive('table')) {
					const del = confirm('Do you really want to delete this table??');
					if (del) {
						editor.chain().focus().deleteTable().run();
						return;
					}
				}
				editor.chain().focus().insertTable({ cols: 3, rows: 3, withHeaderRow: false }).run();
			},
			isActive: (editor) => editor.isActive('table')
		}
	],
	math: [
		{
			icon: Radical,
			name: 'mathematics',
			tooltip: strings.command.inlineExpression,
			onClick: (editor) => {
				let latex = 'a^2 + b^2 = c^2';
				const chain = editor.chain().focus();
				if (isTextSelection(editor.view.state.selection)) {
					const { from, to } = editor.view.state.selection;
					latex = editor.view.state.doc.textBetween(from, to);
					chain.deleteRange({ from, to });
				}
				chain.insertInlineMath({ latex }).run();
			},
			isActive: (editor) => editor.isActive('inlineMath')
		},
		{
			icon: SquareRadical,
			name: 'mathematics',
			tooltip: strings.command.blockExpression,
			onClick: (editor) => {
				const latex = 'a^2 + b^2 = c^2';
				editor.chain().focus().insertBlockMath({ latex }).run();
			},
			isActive: (editor) => editor.isActive('blockMath')
		}
	]
};

export default commands;
