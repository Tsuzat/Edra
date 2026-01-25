import type { FileType } from '../utils.js';
import { Extension, type CommandProps } from '@tiptap/core';

export interface FileDropOptions {
	/**
	 * The current handler. By default it just echoes back the input.
	 */
	handler: (files: string) => Promise<string>;
	/**
	 * The local file selector/getter. By default it returns an empty string.
	 * This function allows consumers to open a local file picker or otherwise
	 * provide a local file reference for the given file type.
	 */
	localFileGetter: (fileType: FileType) => Promise<string | null>;
}

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		fileDrop: {
			/**
			 * Set the handler that takes an array of local file paths
			 * and returns a Promise of the uploaded URLs.
			 */
			setHandleFileDrop: (handler: (file: string) => Promise<string>) => ReturnType;
			/**
			 * Call the handler you registered above,
			 * returns a Promise<string[]> of the uploaded URLs.
			 */
			handleFileDrop: (file: string) => ReturnType;
		};
	}

	interface Storage {
		fileDrop: {
			handler: (file: string) => Promise<string>;
			assetsGetter: (fileType: string) => Promise<string[]>;
			localFileGetter: (fileType: string) => Promise<string | null>;
		};
	}
}

export const FileDrop = Extension.create<FileDropOptions>({
	name: 'fileDrop',

	// initial default handlers
	addOptions() {
		return {
			handler: async (file: string) => file,
			assetsGetter: async () => [],
			localFileGetter: async () => ''
		};
	},

	// this creates a little storage bucket on `editor.storage.fileDrop`
	addStorage() {
		return {
			handler: this.options.handler,
			localFileGetter: this.options.localFileGetter
		};
	},

	addCommands() {
		return {
			setHandleFileDrop:
				(handler) =>
				({ editor }: CommandProps) => {
					editor.storage.fileDrop.handler = handler;
					return true;
				},

			handleFileDrop:
				(file) =>
				({ editor }: CommandProps) => {
					// await the currently-registered handler
					void editor.storage.fileDrop.handler(file);
					return true;
				}
		};
	}
});
