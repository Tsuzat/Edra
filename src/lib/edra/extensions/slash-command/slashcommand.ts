import { Editor, Extension } from '@tiptap/core';
import Suggestion, { type SuggestionProps, type SuggestionKeyDownProps } from '@tiptap/suggestion';
import { PluginKey } from '@tiptap/pm/state';

import { GROUPS } from './groups.js';
import SvelteRenderer from '../../svelte-renderer.js';
import tippy from 'tippy.js';
import type { Component } from 'svelte';

const extensionName = 'slashCommand';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let popup: any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (menuList: Component<any, any, ''>): Extension =>
	Extension.create({
		name: extensionName,

		priority: 200,

		onCreate() {
			popup = tippy('body', {
				interactive: true,
				trigger: 'manual',
				placement: 'bottom-start',
				theme: 'slash-command',
				maxWidth: '16rem',
				offset: [16, 8],
				popperOptions: {
					strategy: 'fixed',
					modifiers: [
						{
							name: 'flip',
							enabled: false
						}
					]
				}
			});
		},

		addProseMirrorPlugins() {
			return [
				Suggestion({
					editor: this.editor,
					char: '/',
					allowSpaces: true,
					pluginKey: new PluginKey(extensionName),
					allow: ({ state, range }) => {
						const $from = state.doc.resolve(range.from);
						const afterContent = $from.parent.textContent?.substring(
							$from.parent.textContent?.indexOf('/')
						);
						const isValidAfterContent = !afterContent?.endsWith('  ');

						return isValidAfterContent;
					},
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					command: ({ editor, props }: { editor: Editor; props: any }) => {
						const { view, state } = editor;
						const { $head, $from } = view.state.selection;

						try {
							const end = $from.pos;
							const from = $head?.nodeBefore
								? end -
									($head.nodeBefore.text?.substring($head.nodeBefore.text?.indexOf('/')).length ??
										0)
								: $from.start();

							const tr = state.tr.deleteRange(from, end);
							view.dispatch(tr);
						} catch (error) {
							console.error(error);
						}

						props.onClick(editor);
						view.focus();
					},
					items: ({ query }: { query: string }) => {
						const withFilteredCommands = GROUPS.map((group) => ({
							...group,
							commands: group.actions.filter((item) => {
								const labelNormalized = item.tooltip!.toLowerCase().trim();
								const queryNormalized = query.toLowerCase().trim();
								return labelNormalized.includes(queryNormalized);
							})
						}));

						const withoutEmptyGroups = withFilteredCommands.filter((group) => {
							if (group.commands.length > 0) {
								return true;
							}

							return false;
						});

						const withEnabledSettings = withoutEmptyGroups.map((group) => ({
							...group,
							commands: group.commands.map((command) => ({
								...command,
								isEnabled: true
							}))
						}));

						return withEnabledSettings;
					},
					render: () => {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						let component: any;

						let scrollHandler: (() => void) | null = null;

						return {
							onStart: (props: SuggestionProps) => {
								component = new SvelteRenderer(menuList, {
									props,
									editor: props.editor
								});

								const { view } = props.editor;

								const getReferenceClientRect = () => {
									if (!props.clientRect) {
										return props.editor.storage[extensionName].rect;
									}

									const rect = props.clientRect();

									if (!rect) {
										return props.editor.storage[extensionName].rect;
									}

									let yPos = rect.y;

									if (rect.top + component.element.offsetHeight + 40 > window.innerHeight) {
										const diff =
											rect.top + component.element.offsetHeight - window.innerHeight + 40;
										yPos = rect.y - diff;
									}

									return new DOMRect(rect.x, yPos, rect.width, rect.height);
								};

								scrollHandler = () => {
									popup?.[0].setProps({
										getReferenceClientRect
									});
								};

								view.dom.parentElement?.addEventListener('scroll', scrollHandler);

								popup?.[0].setProps({
									getReferenceClientRect,
									appendTo: () => document.body,
									content: component.element
								});

								popup?.[0].show();
							},

							onUpdate(props: SuggestionProps) {
								component.updateProps(props);

								const { view } = props.editor;

								const getReferenceClientRect = () => {
									if (!props.clientRect) {
										return props.editor.storage[extensionName].rect;
									}

									const rect = props.clientRect();

									if (!rect) {
										return props.editor.storage[extensionName].rect;
									}

									let yPos = rect.y;

									if (rect.top + component.element.offsetHeight + 40 > window.innerHeight) {
										const diff =
											rect.top + component.element.offsetHeight - window.innerHeight + 40;
										yPos = rect.y - diff;
									}

									return new DOMRect(rect.x, yPos, rect.width, rect.height);
								};

								const scrollHandler = () => {
									popup?.[0].setProps({
										getReferenceClientRect
									});
								};

								view.dom.parentElement?.addEventListener('scroll', scrollHandler);

								props.editor.storage[extensionName].rect = props.clientRect
									? getReferenceClientRect()
									: {
											width: 0,
											height: 0,
											left: 0,
											top: 0,
											right: 0,
											bottom: 0
										};
								popup?.[0].setProps({
									getReferenceClientRect
								});
							},

							onKeyDown(props: SuggestionKeyDownProps) {
								if (props.event.key === 'Escape') {
									popup?.[0].hide();
									return true;
								}

								if (!popup?.[0].state.isShown) {
									popup?.[0].show();
								}

								if (props.event.key === 'Enter') return true;

								// return component.ref?.onKeyDown(props);
								return false;
							},

							onExit(props) {
								popup?.[0].hide();
								if (scrollHandler) {
									const { view } = props.editor;
									view.dom.parentElement?.removeEventListener('scroll', scrollHandler);
								}
								component.destroy();
							}
						};
					}
				})
			];
		},

		addStorage() {
			return {
				rect: {
					width: 0,
					height: 0,
					left: 0,
					top: 0,
					right: 0,
					bottom: 0
				}
			};
		}
	});
