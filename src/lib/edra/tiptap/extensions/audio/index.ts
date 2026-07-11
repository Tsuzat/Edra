import { Node, nodeInputRule } from '@tiptap/core';

export interface AudioOptions {
	HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		audio: {
			/**
			 * Set a audio node
			 */
			setAudio: ({ src }: { src: string }) => ReturnType;
			/**
			 * Remove a audio
			 */
			removeAudio: () => ReturnType;
		};
	}
}

const AUDIO_INPUT_REGEX = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;

export const Audio = Node.create<AudioOptions>({
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
				({ src }: { src: string }) =>
				({ commands }) =>
					commands.insertContent(
						`<audio preload="none" controls autoplay="false" style="width: 100%;" src="${src}"/>`
					),

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
	}
});
