import { Video } from './Video.js';
import { SvelteNodeViewRenderer } from '../../index.ts';
import type { Component } from 'svelte';
import type { NodeViewProps } from '@tiptap/core';

export const VideoExtended = (component: Component<NodeViewProps>) =>
	Video.extend({
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
	});
