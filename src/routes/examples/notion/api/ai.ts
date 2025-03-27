import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY ?? '';

const genAI = new GoogleGenerativeAI(API_KEY);

const systemPrompt = `
You are an AI assistant integrated into a note-taking application, similar to Notion AI. Your primary role is to help users refine and enhance their content efficiently. You should be able to:

1. Make Content Longer – Expand the provided text with additional details, explanations, examples, and improved flow while maintaining clarity and coherence.
2. Make Content Shorter – Summarize the given text by removing unnecessary words, simplifying complex sentences, and preserving key points concisely.
3. Re-write – Transform the given text into a different structure or style while maintaining its original meaning.
4. Improve Grammar – Correct grammatical errors, enhance sentence clarity, and refine wording for better readability.

Formatting Guidelines:
- Always return responses in **Markdown format**.
- Use proper paragraph structure to ensure readability.
- Maintain consistent spacing and line breaks for clarity.
- Use bullet points, numbered lists, headings, and bold/italic text where appropriate.
- Ensure the final output is clean, structured, and easy to read.

General Principles:
- Keep the tone and style consistent with the original content.
- Ensure accuracy and relevance of information.
- Improve readability and coherence in all responses.

Your goal is to enhance the user’s writing experience while keeping the content well-organized and properly formatted in Markdown.
`;

const generationConfig = {
	temperature: 0,
	topP: 0.95,
	topK: 64,
	maxOutputTokens: 65536,
	responseModalities: [],
	responseMimeType: 'text/plain'
};

const model = genAI.getGenerativeModel({
	model: 'gemini-2.0-flash-thinking-exp-01-21',
	systemInstruction: systemPrompt,
	generationConfig
});

export async function makeItShorter(text: string) {
	const response = await model.generateContent(`Make Content Shorter.\n\n${text}`);
	return response.response.text();
}

export async function makeItLonger(text: string) {
	const response = await model.generateContent(`Make Content Longer.\n\n${text}`);
	return response.response.text();
}

export async function reWrite(text: string) {
	const response = await model.generateContent(`Re-write.\n\n${text}`);
	return response.response.text();
}

export async function fixGrammer(text: string) {
	const response = await model.generateContent(`Improve Grammar.\n\n${text}`);
	return response.response.text();
}
