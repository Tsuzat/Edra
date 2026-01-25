import type { Content, Editor } from '@tiptap/core';
import type { EditorState } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';
import type { Snippet } from 'svelte';
export type { Content, Editor };

export interface EdraEditorProps {
	/**
	 * Initial content to be set for editor
	 */
	content?: Content;
	/**
	 * Initial State of the editor
	 */
	editable?: boolean;
	/**
	 * Bindable editor instance
	 */
	editor?: Editor;
	/**
	 * Bindable Editor HTMLElement instance
	 */
	element?: HTMLElement;
	/**
	 * Let's editor have auto focus when Initialed
	 */
	autofocus?: boolean;
	/**
	 * Call back when editor content changes
	 * @returns
	 */
	onUpdate?: () => void;
	/**
	 * Optional class for editor
	 */
	class?: string;
	/**
	 * Should spell check be done
	 */
	spellcheck?: boolean;
	/**
	 * Use this to upload or process a file once it's selected returning final file source.
	 * Usefull when you want user to upload a file from system, upload it and set the final path as content source
	 * @param file Current File Path from System
	 * @returns Promise<string> - Final Path of file
	 */
	onFileSelect?: (file: string) => Promise<string>;
	/**
	 * Runs when a file is dropped or pasted on editor returning final file source.
	 * Usefull when you want user to Drop a file on editor, process and(or) upload it
	 * and set the final path as content source
	 * @param file File
	 * @returns finalPath string
	 */
	onDropOrPaste?: (file: File) => Promise<string>;
}

export interface EdraToolbarProps {
	editor: Editor;
	class?: string;
	excludedCommands?: string[];
	children?: Snippet<[]>;
}

export interface ShouldShowProps {
	editor: Editor;
	element: HTMLElement;
	view: EditorView;
	state: EditorState;
	oldState?: EditorState;
	from: number;
	to: number;
}
