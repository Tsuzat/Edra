export const providerCode = `import { createEditor } from '$lib/edra/shadcn/index.js';

async function callAI(
	prompt: string,
	onChunk: (chunk: string) => void,
	onError: (error: Error) => void
) {
	// Call your endpoint (e.g. Gemini, OpenAI, Claude) and stream chunks:
	const response = await fetch('/api/chat', {
		method: 'POST',
		body: JSON.stringify({ prompt })
	});
	
	const reader = response.body?.getReader();
	// read stream and call onChunk(textChunk)
}`;

export const initCode = `const editor = createEditor({
	callAI: callAI
});`;
