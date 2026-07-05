import type { Node } from '@tiptap/core';
import Image, { type ImageOptions } from '@tiptap/extension-image';
import { SvelteNodeViewRenderer } from '../../index.ts';

export const ImageExtended = (component: any): Node<ImageOptions, unknown> => {
	return Image.extend({
		addAttributes() {
			return {
				src: {
					default: null
				},
				alt: {
					default: null
				},
				title: {
					default: null
				},
				width: {
					default: '100%'
				},
				height: {
					default: null
				},
				align: {
					default: 'left'
				}
			};
		},
		addNodeView: () => {
			return SvelteNodeViewRenderer(component);
		}
	}).configure({
		allowBase64: false
	});
};
