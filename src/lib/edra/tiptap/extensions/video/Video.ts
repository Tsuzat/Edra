import type { ResizableNodeViewDirection } from '@tiptap/core';
import { mergeAttributes, Node, nodeInputRule, ResizableNodeView } from '@tiptap/core';

export interface VideoOptions {
	/**
	 * Controls if the Video node should be inline or not.
	 * @default false
	 * @example true
	 */
	inline: boolean;

	/**
	 * Controls if base64 Videos are allowed. Enable this if you want to allow
	 * base64 Video urls in the `src` attribute.
	 * @default false
	 * @example true
	 */
	allowBase64: boolean;

	/**
	 * HTML attributes to add to the Video element.
	 * @default {}
	 * @example { class: 'foo' }
	 */
	HTMLAttributes: Record<string, unknown>;

	/**
	 * Controls if the Video should be resizable and how the resize is configured.
	 * @default false
	 * @example { directions: { top: true, right: true, bottom: true, left: true, topLeft: true, topRight: true, bottomLeft: true, bottomRight: true }, minWidth: 100, minHeight: 100 }
	 */
	resize:
		| {
				enabled: boolean;
				directions?: ResizableNodeViewDirection[];
				minWidth?: number;
				minHeight?: number;
				alwaysPreserveAspectRatio?: boolean;
		  }
		| false;
}

export interface SetVideoOptions {
	src: string;
	alt?: string;
	title?: string;
	width?: number;
	height?: number;
}

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		video: {
			/**
			 * Add a Video
			 * @param options The Video attributes
			 * @example
			 * editor
			 *   .commands
			 *   .setVideo({ src: 'https://...', alt: 'video', title: 'my video' })
			 */
			setVideo: (options: SetVideoOptions) => ReturnType;
		};
	}
}

/**
 * Matches a Video to a ![Video](src "title") on input.
 */
export const inputRegex = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;

export const Video = Node.create<VideoOptions>({
	name: 'video',

	addOptions() {
		return {
			inline: false,
			allowBase64: false,
			HTMLAttributes: {},
			resize: false,
			onDrop: undefined
		};
	},

	inline() {
		return this.options.inline;
	},

	group() {
		return this.options.inline ? 'inline' : 'block';
	},

	draggable: true,

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
			}
		};
	},

	parseHTML() {
		return [
			{
				tag: this.options.allowBase64 ? 'video[src]' : 'video[src]:not([src^="data:"])'
			}
		];
	},

	renderHTML({ HTMLAttributes }) {
		return [
			'video',
			mergeAttributes(
				{ controls: 'true', preload: 'none', playsinline: 'true' },
				this.options.HTMLAttributes,
				HTMLAttributes
			)
		];
	},

	parseMarkdown: (token, helpers) => {
		return helpers.createNode('video', {
			src: token.href,
			title: token.title,
			alt: token.text
		});
	},

	renderMarkdown: (node) => {
		const src = node.attrs?.src ?? '';
		const alt = node.attrs?.alt ?? '';
		const title = node.attrs?.title ?? '';

		return title ? `![${alt}](${src} "${title}")` : `![${alt}](${src})`;
	},

	addNodeView() {
		if (!this.options.resize || !this.options.resize.enabled || typeof document === 'undefined') {
			return null;
		}

		const { directions, minWidth, minHeight, alwaysPreserveAspectRatio } = this.options.resize;

		return ({ node, getPos, HTMLAttributes, editor }) => {
			const el = document.createElement('video');
			el.draggable = false;
			el.controls = true;
			el.preload = 'none';
			el.playsInline = true;

			const mergedAttributes = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes);

			Object.entries(mergedAttributes).forEach(([key, value]) => {
				if (value != null) {
					switch (key) {
						case 'width':
						case 'height':
							break;
						default:
							el.setAttribute(key, value);
							break;
					}
				}
			});

			if (mergedAttributes.src !== null) {
				el.src = mergedAttributes.src;
			}

			const nodeView = new ResizableNodeView({
				element: el,
				editor,
				node,
				getPos,
				onResize: (width, height) => {
					el.style.width = `${width}px`;
					el.style.height = `${height}px`;
				},
				onCommit: (width, height) => {
					const pos = getPos();
					if (pos === undefined) {
						return;
					}

					this.editor
						.chain()
						.setNodeSelection(pos)
						.updateAttributes(this.name, {
							width,
							height
						})
						.run();
				},
				onUpdate: (updatedNode) => {
					if (updatedNode.type !== node.type) {
						return false;
					}

					return true;
				},
				options: {
					directions,
					min: {
						width: minWidth,
						height: minHeight
					},
					preserveAspectRatio: alwaysPreserveAspectRatio === true
				}
			});

			const dom = nodeView.dom as HTMLElement;

			// when Video metadata is loaded, show the node view to get the correct dimensions
			dom.style.visibility = 'hidden';
			dom.style.pointerEvents = 'none';
			el.onloadedmetadata = () => {
				dom.style.visibility = '';
				dom.style.pointerEvents = '';
			};

			return nodeView;
		};
	},

	addCommands() {
		return {
			setVideo:
				(options) =>
				({ commands }) => {
					return commands.insertContent({
						type: this.name,
						attrs: options
					});
				}
		};
	},
	addInputRules() {
		return [
			nodeInputRule({
				find: inputRegex,
				type: this.type,
				getAttributes: (match) => {
					const [, , alt, src, title] = match;

					return { src, alt, title };
				}
			})
		];
	}
});
