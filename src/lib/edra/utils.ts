import type { Editor } from '@tiptap/core';
import type { Node } from '@tiptap/pm/model';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
import strings from './strings.js';

/**
 * Check if the current browser is in mac or not
 */
export const ISMAC = isBrowser
	? navigator.userAgent.includes('Macintosh') || navigator.userAgent.includes('Mac OS X')
	: false;

export const getKeyboardShortcut = (key: string, ctrl = false, shift = false, alt = false) => {
	const modifiers: string[] = [];
	if (ISMAC) {
		if (ctrl) modifiers.push('⌘');
		if (shift) modifiers.push('⇧');
		if (alt) modifiers.push('⌥');
	} else {
		if (ctrl) modifiers.push('Ctrl');
		if (shift) modifiers.push('Shift');
		if (alt) modifiers.push('Alt');
	}

	return [...modifiers, key].join(' ');
};

/**
 * Find colors in the document
 * @param doc Node - node to find colors in
 * @returns DecorationSet - set of decorations for the colors found in the node
 */
export const findColors = (doc: Node) => {
	const hexColor = /(#[0-9a-f]{3,6})\b/gi;
	const decorations: Decoration[] = [];

	doc.descendants((node, position) => {
		if (!node.text) {
			return;
		}

		Array.from(node.text.matchAll(hexColor)).forEach((match) => {
			const color = match[0];
			const index = match.index || 0;
			const from = position + index;
			const to = from + color.length;
			const decoration = Decoration.inline(from, to, {
				class: 'color',
				style: `--color: ${color}`
			});

			decorations.push(decoration);
		});
	});

	return DecorationSet.create(doc, decorations);
};

/**
 * Dupilcate content at the current selection
 * @param editor Editor instance
 * @param node Node to be duplicated
 */
export const duplicateContent = (editor: Editor, node: Node) => {
	const { view } = editor;
	const { state } = view;
	const { selection } = state;

	editor
		.chain()
		.insertContentAt(selection.to, node.toJSON(), {
			updateSelection: true
		})
		.focus(selection.to)
		.run();
};

export const isURL = (str: string): boolean => {
	try {
		new URL(str);
		return true;
	} catch {
		return false;
	}
};

export const quickcolors = [
	{ label: strings.toolbar.color.default, value: '' },
	{ label: strings.toolbar.color.blue, value: '#0E0E99' },
	{ label: strings.toolbar.color.brown, value: '#7D0404' },
	{ label: strings.toolbar.color.green, value: '#077507' },
	{ label: strings.toolbar.color.gray, value: '#636262' },
	{ label: strings.toolbar.color.orange, value: '#A34603' },
	{ label: strings.toolbar.color.pink, value: '#DB0762' },
	{ label: strings.toolbar.color.purple, value: '#83069C' },
	{ label: strings.toolbar.color.red, value: '#B30707' },
	{ label: strings.toolbar.color.yellow, value: '#C4C404' }
];
