import { json, type RequestHandler } from '@sveltejs/kit';
import { fixGrammer, makeItLonger, makeItShorter, reWrite } from './ai.js';

interface ReqBody {
	tool: 'longer' | 'shorter' | 're-write' | 'fix-grammar';
	text: string;
}

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

export const POST: RequestHandler = async ({ request }) => {
	try {
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
