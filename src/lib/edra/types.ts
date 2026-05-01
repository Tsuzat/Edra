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
	/**
	 * Callback fired once the editor instance is created. Useful as an
	 * alternative to `bind:editor` when binding via `$state` does not
	 * propagate (e.g. when reactivity tracking is not established before
	 * the editor mounts).
	 */
	oneditor?: (editor: Editor) => void;
	/**
	 * Restrict the editor to features that round-trip cleanly to Markdown.
	 * Disables non-MD extensions (math, video, audio, iframe, underline,
	 * super/subscript, alignment, font size, colors) and shows a simplified
	 * toolbar. Markdown output is available via `editor.storage.markdown.getMarkdown()`
	 * or the `getMarkdown(editor)` helper.
	 */
	markdown?: boolean;
}

export interface EdraToolbarProps {
	editor: Editor;
	class?: string;
	excludedCommands?: string[];
	children?: Snippet<[]>;
	/**
	 * Render only the Markdown-compatible subset of toolbar commands.
	 */
	markdown?: boolean;
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
