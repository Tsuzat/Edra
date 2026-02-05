import type { Editor } from '@tiptap/core';
import type { Node } from '@tiptap/pm/model';
import { Decoration, DecorationSet, type EditorView } from '@tiptap/pm/view';
import { browser } from '$app/environment';
import strings from './strings.js';

/**
 * Check if the current browser is in mac or not
 */
export const isMac = browser
	? navigator.userAgent.includes('Macintosh') || navigator.userAgent.includes('Mac OS X')
	: false;

export const getKeyboardShortcut = (key: string, ctrl = false, shift = false, alt = false) => {
	const modifiers: string[] = [];
	if (isMac) {
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
 * Function to handle paste event of an image
 * @param editor Editor - editor instance
 * @param maxSize number - max size of the image to be pasted in MB, default is 2MB
 */
export function getHandlePasteImage(onDropOrPaste?: (file: File) => Promise<string>) {
	return (view: EditorView, event: ClipboardEvent) => {
		const item = event.clipboardData?.items[0];
		if (item?.type.indexOf('image') !== 0) {
			return;
		}
		const file = item.getAsFile();
		if (file === null || file.size === undefined) return;
		onDropOrPaste?.(file)
			.then((src) => {
				const node = view.state.schema.nodes.image.create({ src });
				const transaction = view.state.tr.replaceSelectionWith(node);
				view.dispatch(transaction);
			})
			.catch((error) => {
				console.error(error);
			});
		return true;
	};
}

export function getHandleDropImage(onDropOrPaste?: (file: File) => Promise<string>) {
	return (view: EditorView, event: DragEvent) => {
		const files = Array.from(event.dataTransfer?.files ?? []);
		if (files.length === 0) return;
		const file = files[0];
		if (file === null || file.size === undefined) return;
		onDropOrPaste?.(file)
			.then((src) => {
				const node = view.state.schema.nodes.image.create({ src });
				const transaction = view.state.tr.replaceSelectionWith(node);
				view.dispatch(transaction);
			})
			.catch((error) => {
				console.error(error);
			});
		return true;
	};
}

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
	let isUrl = true;
	try {
		new URL(str);
		isUrl = true;
	} catch {
		isUrl = false;
	}
	return isUrl;
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

export enum FileType {
	IMAGE = 'image/*',
	VIDEO = 'video/*',
	AUDIO = 'audio/*',
	DOCS = 'docs/*',
	UNKNOWN = 'unknown'
}

/**
 * Helper function to get web standard file extensions
 * @param fileType - FileType
 * @returns - Array of file extensions
 */
export const getFileTypeExtensions = (fileType: FileType) => {
	switch (fileType) {
		case FileType.IMAGE:
			return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
		case FileType.VIDEO:
			return ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];
		case FileType.AUDIO:
			return ['mp3', 'wav', 'ogg', 'flac', 'aac'];
		case FileType.DOCS:
			return ['docx', 'doc', 'pptx', 'ppt', 'xlsx', 'xls'];
		case FileType.UNKNOWN:
			return [];
	}
};

/**
 * Get file MIME type from file extension
 * @param fileName - file name with extension
 * @returns - file type or null if unknown
 */
export const getFileTypeFromExtension = (fileName: string): string | null => {
	const extension = fileName.toLowerCase().split('.').pop();

	if (!extension) return null;

	const mimeTypes: Record<string, string> = {
		// Images
		jpg: 'image/jpeg',
		jpeg: 'image/jpeg',
		png: 'image/png',
		gif: 'image/gif',
		bmp: 'image/bmp',
		webp: 'image/webp',
		svg: 'image/svg+xml',
		ico: 'image/x-icon',
		tiff: 'image/tiff',
		tif: 'image/tiff',

		// Videos
		mp4: 'video/mp4',
		avi: 'video/x-msvideo',
		mov: 'video/quicktime',
		wmv: 'video/x-ms-wmv',
		flv: 'video/x-flv',
		webm: 'video/webm',
		mkv: 'video/x-matroska',
		m4v: 'video/x-m4v',
		'3gp': 'video/3gpp',
		ogv: 'video/ogg',

		// Audio
		mp3: 'audio/mpeg',
		wav: 'audio/wav',
		flac: 'audio/flac',
		aac: 'audio/aac',
		ogg: 'audio/ogg',
		m4a: 'audio/mp4',
		wma: 'audio/x-ms-wma',
		opus: 'audio/opus',
		aiff: 'audio/aiff',

		// Docs
		docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		doc: 'application/msword',
		pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
		ppt: 'application/vnd.ms-powerpoint',
		xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		xls: 'application/vnd.ms-excel',
		pdf: 'application/pdf'
	};

	return mimeTypes[extension] ?? null;
};
