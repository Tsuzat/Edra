import { createHighlighter } from 'shiki';

export const highlighter = await createHighlighter({
	langs: ['html', 'css', 'js', 'ts', 'svelte', 'shell', 'diff', 'json'],
	themes: ['github-dark', 'github-light']
});
