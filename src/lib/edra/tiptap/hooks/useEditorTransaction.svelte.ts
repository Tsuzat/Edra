import type { Editor } from '../Editor.ts';

/**
 * Svelte 5 rune-based hook that provides a reactive transaction counter.
 * Reading `version` inside a template expression creates a dependency
 * that re-evaluates on every editor transaction.
 */
export function useEditorTransaction(editor: Editor) {
	let version = $state(0);

	$effect(() => {
		const handler = () => {
			version++;
		};
		editor.on('transaction', handler);
		return () => {
			editor.off('transaction', handler);
		};
	});

	return {
		get version() {
			return version;
		}
	};
}
