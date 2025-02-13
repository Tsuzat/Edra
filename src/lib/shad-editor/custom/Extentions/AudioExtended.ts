import { SvelteNodeViewRenderer } from 'svelte-tiptap';
import { Audio } from './AudioExtention.js';
import AudioExtendedComponent from '../audio-extended-component.svelte';

export const AudioExtention = Audio.extend({
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
		return SvelteNodeViewRenderer(AudioExtendedComponent);
	}
});
