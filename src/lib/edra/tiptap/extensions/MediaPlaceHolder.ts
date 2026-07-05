import { mergeAttributes, Node } from '@tiptap/core';
import { SvelteNodeViewRenderer } from '../index.ts';

export interface MediaPlaceholderOptions {
	HTMLAttributes: Record<string, any>;
	onUpload?: (file: File) => Promise<string>;
}

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		mediaPlaceholder: {
			/**
			 * Inserts a media placeholder
			 */
			insertMediaPlaceholder: (options: {
				mediaType: 'image' | 'video' | 'audio' | 'iframe';
			}) => ReturnType;

			/**
			 * Set the upload handler
			 */
			setMediaUploadHandler: (handler: (file: File) => Promise<string>) => ReturnType;

			/**
			 * Upload a media and insert the result
			 */
			uploadMedia: (file: File) => ReturnType;
		};
	}

	interface Storage {
		mediaPlaceholder: {
			onUpload?: (file: File) => Promise<string>;
		};
	}
}

export const MediaPlaceholder = (component: any) =>
	Node.create<MediaPlaceholderOptions>({
		name: 'mediaPlaceholder',

		addOptions() {
			return {
				HTMLAttributes: {},
				onUpload: undefined
			};
		},

		addStorage() {
			return {
				onUpload: this.options.onUpload
			};
		},

		addAttributes() {
			return {
				mediaType: {
					default: 'image',
					parseHTML: (element) => element.getAttribute('data-media-type'),
					renderHTML: (attributes) => {
						if (!attributes.mediaType) {
							return {};
						}
						return {
							'data-media-type': attributes.mediaType
						};
					}
				}
			};
		},

		parseHTML() {
			return [{ tag: `div[data-type="${this.name}"]` }];
		},

		renderHTML({ HTMLAttributes }) {
			return [
				'div',
				mergeAttributes({ 'data-type': this.name }, this.options.HTMLAttributes, HTMLAttributes)
			];
		},

		group: 'block',
		draggable: true,
		atom: true,
		content: 'inline*',
		isolating: true,

		addNodeView() {
			return SvelteNodeViewRenderer(component);
		},

		addCommands() {
			return {
				insertMediaPlaceholder:
					(options) =>
					({ commands }) => {
						return commands.insertContent({
							type: this.name,
							attrs: {
								mediaType: options.mediaType
							}
						});
					},

				setMediaUploadHandler:
					(handler) =>
					({ editor }) => {
						editor.storage.mediaPlaceholder.onUpload = handler;
						return true;
					},

				uploadMedia:
					(file: File) =>
					({ editor }) => {
						const onUpload = editor.storage.mediaPlaceholder.onUpload || this.options.onUpload;
						if (!onUpload) {
							throw new Error('onUpload is not defined');
						}

						// Detect mediaType from current selection
						let mediaType = 'image';
						const { selection } = editor.state;
						if (selection && 'node' in selection) {
							const selectedNode = (selection as any).node;
							if (selectedNode.type.name === this.name) {
								mediaType = selectedNode.attrs.mediaType;
							}
						}

						void onUpload(file)
							.then((src) => {
								editor.view.focus();
								if (mediaType === 'audio') {
									editor.commands.setAudio({ src });
								} else if (mediaType === 'video') {
									editor.commands.setVideo({ src });
								} else {
									editor.commands.setImage({ src });
								}
							})
							.catch((error) => {
								console.error('Failed to upload media:', error);
							});

						return true;
					}
			};
		}
	});
