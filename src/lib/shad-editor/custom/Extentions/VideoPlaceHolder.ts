import { Editor, Node, mergeAttributes, type CommandProps } from '@tiptap/core';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';
import VideoPlaceholderComponent from '../video-placeholder-component.svelte';

export interface ImagePlaceholderOptions {
	HTMLAttributes: Record<string, object>;
	onDrop: (files: File[], editor: Editor) => void;
	onDropRejected?: (files: File[], editor: Editor) => void;
	onEmbed: (url: string, editor: Editor) => void;
	allowedMimeTypes?: Record<string, string[]>;
	maxFiles?: number;
	maxSize?: number;
}

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		videoPlaceholder: {
			/**
			 * Inserts an video placeholder
			 */
			insertVideoPlaceholder: () => ReturnType;
		};
	}
}

export const VideoPlaceholder = Node.create<ImagePlaceholderOptions>({
	name: 'video-placeholder',
	addOptions() {
		return {
			HTMLAttributes: {},
			onDrop: () => {},
			onDropRejected: () => {},
			onEmbed: () => {}
		};
	},
	parseHTML() {
		return [{ tag: `div[data-type="${this.name}"]` }];
	},

	renderHTML({ HTMLAttributes }) {
		return ['div', mergeAttributes(HTMLAttributes)];
	},
	group: 'block',
	draggable: true,
	atom: true,
	content: 'inline*',
	isolating: true,

	addNodeView() {
		return SvelteNodeViewRenderer(VideoPlaceholderComponent);
	},
	addCommands() {
		return {
			insertVideoPlaceholder: () => (props: CommandProps) => {
				return props.commands.insertContent({
					type: 'video-placeholder'
				});
			}
		};
	}
});
