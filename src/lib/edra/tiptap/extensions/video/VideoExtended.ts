import { Video } from './Video.js';
import { SvelteNodeViewRenderer } from '../../index.ts';

export const VideoExtended = (content: any) =>
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
			return SvelteNodeViewRenderer(content);
		}
	});
