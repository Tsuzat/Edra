import { Node, nodeInputRule } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { toast } from 'svelte-sonner';
import strings from '../../strings.js';

export interface AudioOptions {
	HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		audio: {
			/**
			 * Set a audio node
			 */
			setAudio: (src: string) => ReturnType;
			/**
			 * Toggle a audio
			 */
			toggleAudio: (src: string) => ReturnType;
			/**
			 * Remove a audio
			 */
			removeAudio: () => ReturnType;
		};
	}
}

const AUDIO_INPUT_REGEX = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;

export const Audio = (onDrop?: (file: File) => Promise<string>) =>
	Node.create<AudioOptions>({
		name: 'audio',
		group: 'block',
		draggable: true,
		isolating: true,
		atom: true,
		addOptions() {
			return {
				HTMLAttributes: {}
			};
		},
		addAttributes() {
			return {
				src: {
					default: null,
					parseHTML: (el) => (el as HTMLSpanElement).getAttribute('src'),
					renderHTML: (attrs) => ({ src: attrs.src })
				}
			};
		},
		parseHTML() {
			return [
				{
					tag: 'audio',
					getAttrs: (el) => ({ src: (el as HTMLAudioElement).getAttribute('src') })
				}
			];
		},

		renderHTML({ HTMLAttributes }) {
			return [
				'audio',
				{ controls: 'true', style: 'width: 100%;', ...HTMLAttributes },
				['source', HTMLAttributes]
			];
		},
		addCommands() {
			return {
				setAudio:
					(src: string) =>
					({ commands }) =>
						commands.insertContent(
							`<audio preload="none" controls autoplay="false" style="width: 100%;" src="${src}"/>`
						),

				toggleAudio:
					() =>
					({ commands }) =>
						commands.toggleNode(this.name, 'paragraph'),
				removeAudio:
					() =>
					({ commands }) =>
						commands.deleteNode(this.name)
			};
		},
		addInputRules() {
			return [
				nodeInputRule({
					find: AUDIO_INPUT_REGEX,
					type: this.type,
					getAttributes: (match) => {
						const [, , src] = match;

						return { src };
					}
				})
			];
		},
		addProseMirrorPlugins() {
			return [
				new Plugin({
					key: new PluginKey('audioDropPlugin'),

					props: {
						handleDOMEvents: {
							paste(view, event) {
								const {
									state: { schema, tr },
									dispatch
								} = view;
								const hasFiles =
									event.clipboardData &&
									event.clipboardData.files &&
									event.clipboardData.files.length;

								if (!hasFiles) return false;

								const audios = Array.from(event.clipboardData.files).filter((file) =>
									/audio/i.test(file.type)
								);

								if (audios.length === 0) return false;

								event.preventDefault();

								if (audios.length > 1) {
									toast.warning(strings.extension.audio.multiplePasteWarningTitle, {
										description: strings.extension.audio.multiplePasteWarningDescription
									});
								}

								const audio = audios[0];
								const id = toast.loading(strings.extension.audio.pasteProcessing);
								onDrop?.(audio)
									.then((src) => {
										const node = schema.nodes.audio.create({ src });
										const transaction = tr.replaceSelectionWith(node);
										dispatch(transaction);
										toast.dismiss(id);
									})
									.catch((err) => {
										console.error(err);
										toast.error(strings.extension.audio.pasteError, { id });
									});

								return true;
							},
							drop(view, event) {
								const {
									state: { schema, tr },
									dispatch
								} = view;
								const hasFiles =
									event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length;

								if (!hasFiles) return false;

								const audios = Array.from(event.dataTransfer.files).filter((file) =>
									/audio/i.test(file.type)
								);

								if (audios.length === 0) return false;

								event.preventDefault();

								const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });

								if (audios.length > 1) {
									toast.warning(strings.extension.audio.multipleDropWarningTitle, {
										description: strings.extension.audio.multipleDropWarningDescription
									});
								}

								const audio = audios[0];
								const id = toast.loading(strings.extension.audio.dropProcessing);
								onDrop?.(audio)
									.then((src) => {
										if (coordinates && typeof coordinates.pos === 'number') {
											const node = schema.nodes.audio.create({ src });
											const transaction = tr.insert(coordinates.pos, node);
											dispatch(transaction);
											toast.dismiss(id);
										}
									})
									.catch((err) => {
										console.error(err);
										toast.error(strings.extension.audio.dropError, { id });
									});

								return true;
							}
						}
					}
				})
			];
		}
	});
