import { type Editor, Mark, markInputRule, markPasteRule, mergeAttributes } from '@tiptap/core';

export interface AIHighlightOptions {
	HTMLAttributes: Record<string, string>;
	callAI:
		| ((
				prompt: string,
				onChunk: (chunk: string) => void,
				onError: (error: Error) => void
		  ) => Promise<void>)
		| null;
}

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		AIHighlight: {
			/**
			 * Set a AIHighlight mark
			 */
			setAIHighlight: (attributes?: { color: string }) => ReturnType;
			/**
			 * Toggle a AIHighlight mark
			 */
			toggleAIHighlight: (attributes?: { color: string }) => ReturnType;
			/**
			 * Unset a AIHighlight mark
			 */
			unsetAIHighlight: () => ReturnType;
		};
	}
}

export const inputRegex = /(?:^|\s)((?:==)((?:[^~=]+))(?:==))$/;
export const pasteRegex = /(?:^|\s)((?:==)((?:[^~=]+))(?:==))/g;

export const AIHighlight = Mark.create<AIHighlightOptions>({
	name: 'ai-highlight',

	addOptions() {
		return {
			HTMLAttributes: {},
			callAI: null
		};
	},

	addAttributes() {
		return {
			color: {
				default: null,
				parseHTML: (element) => element.getAttribute('data-color') || element.style.backgroundColor,
				renderHTML: (attributes) => {
					if (!attributes.color) {
						return {};
					}

					return {
						'data-color': attributes.color,
						style: `background-color: ${attributes.color}; color: inherit`
					};
				}
			}
		};
	},

	parseHTML() {
		return [
			{
				tag: 'mark'
			}
		];
	},

	renderHTML({ HTMLAttributes }) {
		return ['mark', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
	},

	addCommands() {
		return {
			setAIHighlight:
				(attributes) =>
				({ commands }) => {
					return commands.setMark(this.name, attributes);
				},
			toggleAIHighlight:
				(attributes) =>
				({ commands }) => {
					return commands.toggleMark(this.name, attributes);
				},
			unsetAIHighlight:
				() =>
				({ commands }) => {
					return commands.unsetMark(this.name);
				}
		};
	},

	addKeyboardShortcuts() {
		return {
			'Mod-Shift-ai': () => this.editor.commands.toggleAIHighlight(),
			// Space bar activation on new line
			Space: () => {
				const { state } = this.editor;
				const { selection } = state;
				const { $from } = selection;

				// Check if we're at the start of a line
				const isAtStart = $from.parentOffset === 0;

				// Check if the line is empty (only contains this position)
				const isEmpty = $from.parent.textContent.length === 0;

				if (isAtStart && isEmpty) {
					// Insert a space character first
					this.editor.commands.insertContent(' ');
					// Select the space we just inserted
					const pos = this.editor.state.selection.$from.pos;
					this.editor.commands.setTextSelection({ from: pos - 1, to: pos });
					// Apply transparent highlight
					this.editor.commands.setAIHighlight({ color: 'transparent' });
					// Move cursor to the end of the selection
					this.editor.commands.focus();
					return true;
				}

				// Return false to allow default space behavior
				return false;
			}
		};
	},

	addInputRules() {
		return [
			markInputRule({
				find: inputRegex,
				type: this.type
			})
		];
	},

	addPasteRules() {
		return [
			markPasteRule({
				find: pasteRegex,
				type: this.type
			})
		];
	}
});

export const removeAIHighlight = (editor: Editor) => {
	let hasMark = false;
	editor.state.doc.descendants((node) => {
		if (node.marks.some((mark) => mark.type.name === 'ai-highlight')) {
			hasMark = true;
			return false;
		}
	});
	if (!hasMark) return;

	const tr = editor.state.tr;
	tr.removeMark(0, editor.state.doc.nodeSize - 2, editor.state.schema.marks['ai-highlight']);
	editor.view.dispatch(tr);
};
export const addAIHighlight = (editor: Editor, color?: string) => {
	const { from, to } = editor.state.selection;
	if (from === to) {
		const $pos = editor.state.doc.resolve(from);
		const depth = $pos.depth;
		const blockFrom = $pos.start(depth);
		const blockTo = $pos.end(depth);
		editor
			.chain()
			.setTextSelection({ from: blockFrom, to: blockTo })
			.setAIHighlight({ color: color ?? '#c1ecf970' })
			.run();
	} else {
		editor
			.chain()
			.setAIHighlight({ color: color ?? '#c1ecf970' })
			.run();
	}
};
