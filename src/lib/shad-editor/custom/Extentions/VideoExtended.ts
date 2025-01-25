import { SvelteNodeViewRenderer } from 'svelte-tiptap';
import { Video } from './VideoExtention.js';
import VideoExtendedComponent from '../video-extended-component.svelte';

export const VideoExtention = Video.extend({
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
		return SvelteNodeViewRenderer(VideoExtendedComponent);
	}
});
