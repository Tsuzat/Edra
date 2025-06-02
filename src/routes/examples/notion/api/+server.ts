import { json, type RequestHandler } from '@sveltejs/kit';
import { fixGrammer, makeItLonger, makeItShorter, reWrite } from './ai.js';
import { RateLimiter } from 'sveltekit-rate-limiter/server';

interface ReqBody {
	tool: 'longer' | 'shorter' | 're-write' | 'fix-grammar';
	text: string;
	apiKey?: string;
}

const limiter = new RateLimiter({
	IP: [
		[100, 'd'],
		[20, 'h']
	], // Limit to 100 requests per hour per IP address
	IPUA: [
		[100, 'd'],
		[20, 'h']
	] // Limit to 50 requests per minute per IP + User Agent
});

async function handleAICall(type: 'longer' | 'shorter' | 're-write' | 'fix-grammar', text: string) {
	switch (type) {
		case 'longer':
			return makeItLonger(text);
		case 'shorter':
			return makeItShorter(text);
		case 're-write':
			return reWrite(text);
		case 'fix-grammar':
			return fixGrammer(text);
		default:
			return fixGrammer(text);
	}
}

export const POST: RequestHandler = async (event) => {
	if (await limiter.isLimited(event)) {
		return json(
			{
				message:
					'Calm down, mate. Maximum 100 requests per day and 20 requests per hour is allowed.'
			},
			{ status: 429 }
		);
	}

	try {
		const request = event.request;
		const data: ReqBody = await request.json();

		const { tool, text } = data;
		if (tool === undefined || text === undefined || text.trim() === '') {
			return json({ message: 'Please provide a tool and text' }, { status: 400 });
		}
		const aiRes = await handleAICall(tool, text);
		return json({ message: aiRes }, { status: 200 });
	} catch (error) {
		console.error('Error parsing JSON:', error);
		return json({ message: error }, { status: 400 });
	}
};
