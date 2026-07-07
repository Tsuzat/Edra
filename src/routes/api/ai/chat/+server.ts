import { GoogleGenAI } from '@google/genai';
import type { RequestHandler } from './$types.js';
import { GEMINI_API_KEY } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	const { prompt } = await request.json();

	if (!prompt) {
		return new Response('Missing prompt', { status: 400 });
	}

	const apiKey = GEMINI_API_KEY;
	if (!apiKey) {
		return new Response('Missing GEMINI_API_KEY configuration', { status: 500 });
	}

	const ai = new GoogleGenAI({ apiKey });

	const stream = new ReadableStream({
		async start(controller) {
			try {
				const responseStream = await ai.models.generateContentStream({
					model: 'gemini-2.5-flash-lite',
					contents: prompt
				});

				const encoder = new TextEncoder();
				for await (const chunk of responseStream) {
					if (chunk.text) {
						controller.enqueue(encoder.encode(chunk.text));
					}
				}
				controller.close();
			} catch (error) {
				console.error('Error generating content stream:', error);
				controller.error(error);
			}
		}
	});

	return new Response(stream, {
		headers: {
			'content-type': 'text/plain; charset=utf-8',
			'x-content-type-options': 'nosniff'
		}
	});
};
