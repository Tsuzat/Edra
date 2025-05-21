import { browser } from '$app/environment';
import type { Editor } from '@tiptap/core';
import type { EditorView } from '@tiptap/pm/view';

/**
 * Check if the current browser is in mac or not
 */
export const isMac = browser
	? navigator.userAgent.includes('Macintosh') || navigator.userAgent.includes('Mac OS X')
	: false;

/**
 * Function to handle paste event of an image
 * @param editor Editor - editor instance
 * @param maxSize number - max size of the image to be pasted in MB, default is 2MB
 */
export function getHandlePaste(editor: Editor, maxSize: number = 2) {
	return (view: EditorView, event: ClipboardEvent) => {
		const item = event.clipboardData?.items[0];

		if (item?.type.indexOf('image') !== 0) {
			return;
		}

		const file = item.getAsFile();
		if (file === null || file.size === undefined) return;
		const filesize = (file?.size / 1024 / 1024).toFixed(4);

		if (filesize && Number(filesize) > maxSize) {
			window.alert(`too large image! filesize: ${filesize} mb`);
			return;
		}

		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = (e) => {
			if (e.target?.result) {
				editor.commands.setImage({ src: e.target.result as string });
			}
		};
	};
}
