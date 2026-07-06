import { mergeAttributes, Node, textblockTypeInputRule } from '@tiptap/core';
import { SvelteNodeViewRenderer } from '../../index.ts';

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		mermaid: {
			setMermaid: (code?: string) => ReturnType;
		};
	}
}

export const Mermaid = (component: any) =>
	Node.create({
		name: 'mermaid',
		group: 'block',
		content: 'text*',
		atom: true,
		code: true,
		defining: true,
		isolating: true,
		draggable: true,

		addAttributes() {
			return {
				HTMLAttributes: {
					default: {}
				}
			};
		},

		markdownTokenizer: {
			name: 'mermaid',
			level: 'block',

			start: (src: string) => {
				return src.indexOf(':::');
			},

			tokenize: (src: string, tokens: any, lexer: any) => {
				// Match :::mermaid\ncontent\n:::
				const match = /^:::mermaid\n([\s\S]*?)\n:::/.exec(src);

				if (!match) {
					return undefined;
				}

				return {
					type: 'mermaid',
					raw: match[0],
					text: match[1], // Content
					tokens: lexer.blockTokens(match[1]) // Parse block content
				};
			}
		},

		parseMarkdown: (token: any) => {
			return {
				type: 'mermaid',
				content: [
					{
						type: 'text',
						text: token.text
					}
				]
			};
		},
		renderMarkdown: (node: any, helpers: any) => {
			return `:::mermaid\n${helpers.renderChildren(node)}\n:::\n\n`;
		},

		parseHTML() {
			return [
				{
					tag: `div[data-type="${this.name}"]`,
					preserveWhitespace: 'full'
				}
			];
		},

		renderHTML({ HTMLAttributes }) {
			return [
				'div',
				mergeAttributes({ 'data-type': this.name }, this.options.HTMLAttributes, HTMLAttributes),
				0
			];
		},

		addCommands() {
			return {
				setMermaid:
					(code) =>
					({ commands }) => {
						return commands.insertContent({
							type: this.name,
							content: [
								{
									type: 'text',
									text: code || ''
								}
							]
						});
					}
			};
		},

		addInputRules() {
			return [
				textblockTypeInputRule({
					find: /^:::mermaid$/,
					type: this.type
				})
			];
		},

		addNodeView() {
			return SvelteNodeViewRenderer(component);
		}
	});
