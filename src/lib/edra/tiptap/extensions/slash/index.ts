import Minus from '@lucide/svelte/icons/minus';
import Quote from '@lucide/svelte/icons/quote';
import SquareCode from '@lucide/svelte/icons/square-code';
import { commands, type EdraCommand } from '$lib/edra/commands/index.js';
import { autoUpdate, computePosition, flip, offset, type Placement } from '@floating-ui/dom';
import { Extension } from '@tiptap/core';
import type { Editor } from '../../../tiptap/index.js';
import { EditorState, PluginKey } from '@tiptap/pm/state';
import Suggestion, { type SuggestionKeyDownProps, type SuggestionProps } from '@tiptap/suggestion';
import type { Component } from 'svelte';
import { SvelteRenderer } from '../../index.ts';
import Lightbulb from '@lucide/svelte/icons/lightbulb';

interface Group {
	name: string;
	title: string;
	actions: EdraCommand[];
}

const GROUPS: Group[] = [
	{
		name: 'format',
		title: 'Format',
		actions: [
			...commands.headings,
			{
				icon: Quote,
				name: 'blockquote',
				tooltip: 'Blockquote',
				onClick: (editor: Editor) => {
					editor.chain().focus().setBlockquote().run();
				}
			},
			{
				icon: SquareCode,
				name: 'codeBlock',
				tooltip: 'Code Block',
				onClick: (editor: Editor) => {
					editor.chain().focus().setCodeBlock().run();
				}
			},
			...commands.lists
		]
	},
	{
		name: 'insert',
		title: 'Insert',
		actions: [
			...commands.media,
			...commands.table,
			...commands.math,
			...commands.diagram,
			{
				icon: Minus,
				name: 'horizontalRule',
				tooltip: 'Horizontal Rule',
				onClick: (editor: Editor) => {
					editor.chain().focus().setHorizontalRule().run();
				}
			},
			{
				icon: Lightbulb,
				name: 'callOut',
				tooltip: 'Callout',
				onClick: (editor: Editor) => {
					editor.chain().focus().setCallout().run();
				}
			}
		]
	}
];

const extensionName = 'slashCommand';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (menuList: Component<any, any, ''>): Extension =>
	Extension.create({
		name: extensionName,

		priority: 200,

		addStorage() {
			return {
				rect: {
					width: 0,
					height: 0,
					left: 0,
					top: 0,
					right: 0,
					bottom: 0
				},
				// Instance-scoped popup state (no module-level singleton)
				popupElement: null as HTMLElement | null,
				popupCleanup: null as (() => void) | null
			};
		},

		onCreate() {
			// Create popup container scoped to this editor instance
			const el = document.createElement('div');
			el.style.position = 'fixed';
			el.style.zIndex = '9999';
			el.style.maxWidth = '16rem';
			el.style.visibility = 'hidden';
			el.style.pointerEvents = 'none';
			el.className = 'slash-command-popup';
			document.body.appendChild(el);
			this.storage.popupElement = el;
		},

		onDestroy() {
			this.storage.popupCleanup?.();
			this.storage.popupElement?.remove();
			this.storage.popupElement = null;
			this.storage.popupCleanup = null;
		},

		addProseMirrorPlugins() {
			const storage = this.storage;

			return [
				Suggestion({
					editor: this.editor,
					char: '/',
					allowSpaces: true,
					pluginKey: new PluginKey(extensionName),
					allow: ({
						state,
						range
					}: {
						state: EditorState;
						range: { from: number; to: number };
					}) => {
						const $from = state.doc.resolve(range.from);
						const afterContent = $from.parent.textContent?.substring(
							$from.parent.textContent?.indexOf('/')
						);
						const isValidAfterContent = !afterContent?.endsWith('  ');

						return isValidAfterContent;
					},
					command: ({ editor, range, props }) => {
						// Use Suggestion's provided range to cleanly delete the /query text
						// instead of manual positional math.
						editor.chain().focus().deleteRange(range).run();
						props.onClick?.(editor);
					},
					items: ({ query }: { query: string }) => {
						const queryNormalized = query.toLowerCase().trim();

						return GROUPS.map((group) => ({
							...group,
							commands: group.actions.filter((item) =>
								item.tooltip!.toLowerCase().trim().includes(queryNormalized)
							)
						})).filter((group) => group.commands.length > 0);
					},
					render: () => {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						let component: any;
						let currentClientRect: (() => DOMRect | null) | null = null;
						let contextElement: Element | null = null;

						const updatePosition = () => {
							if (!storage.popupElement || !currentClientRect) return;

							const rect = currentClientRect();
							if (!rect) return;

							const referenceElement = {
								getBoundingClientRect: () => rect,
								...(contextElement ? { contextElement } : {})
							};

							computePosition(referenceElement, storage.popupElement, {
								placement: 'bottom-start' as Placement,
								strategy: 'fixed',
								middleware: [
									offset({ mainAxis: 8, crossAxis: 16 }),
									flip({ fallbackPlacements: ['top-start', 'bottom-start'] })
								]
							}).then(({ x, y }: { x: number; y: number }) => {
								if (storage.popupElement) {
									storage.popupElement.style.left = `${x}px`;
									storage.popupElement.style.top = `${y}px`;
								}
							});
						};

						return {
							onStart: (props: SuggestionProps) => {
								component = new SvelteRenderer(menuList, {
									props: { ...props }
								});

								currentClientRect = props.clientRect ?? null;
								contextElement = props.editor.view.dom;

								if (storage.popupElement) {
									storage.popupElement.appendChild(component.element);
									storage.popupElement.style.visibility = 'visible';
									storage.popupElement.style.pointerEvents = 'auto';

									updatePosition();

									// autoUpdate handles scroll and resize repositioning —
									// no manual scroll listener needed.
									if (currentClientRect) {
										storage.popupCleanup = autoUpdate(
											{
												getBoundingClientRect: () => currentClientRect?.() || new DOMRect(),
												...(contextElement ? { contextElement } : {})
											},
											storage.popupElement,
											updatePosition
										);
									}
								}
							},

							onUpdate(props: SuggestionProps) {
								component.updateProps(props);
								currentClientRect = props.clientRect ?? null;
								contextElement = props.editor.view.dom;

								// Re-show popup if it was hidden (e.g., after Escape)
								if (storage.popupElement) {
									storage.popupElement.style.visibility = 'visible';
									storage.popupElement.style.pointerEvents = 'auto';
								}

								updatePosition();

								if (currentClientRect) {
									const rect = currentClientRect();
									if (rect) {
										storage.rect = rect;
									}
								}
							},

							onKeyDown(props: SuggestionKeyDownProps) {
								if (props.event.key === 'Escape') {
									if (storage.popupElement) {
										storage.popupElement.style.visibility = 'hidden';
										storage.popupElement.style.pointerEvents = 'none';
									}
									return true;
								}

								// Delegate keyboard handling to the mounted Svelte component
								// instead of relying on a global <svelte:window> listener.
								return component.ref?.handleKeyDown?.(props.event) ?? false;
							},

							onExit() {
								if (storage.popupElement) {
									storage.popupElement.style.visibility = 'hidden';
									storage.popupElement.style.pointerEvents = 'none';
									storage.popupElement.innerHTML = '';
								}

								if (storage.popupCleanup) {
									storage.popupCleanup();
									storage.popupCleanup = null;
								}

								currentClientRect = null;
								contextElement = null;
								component?.destroy();
							}
						};
					}
				})
			];
		}
	});
