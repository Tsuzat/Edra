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
					}
			};
		}
	});
