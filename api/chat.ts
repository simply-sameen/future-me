import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    return res.status(200).send('ok');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, context } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: 'Missing required field: prompt' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: 'AI service not configured' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemContext = context
      ? `You are an expert goal-achievement coach. The user's active goals are:\n${context}\n\n`
      : 'You are a helpful, expert AI coach.';

    const fullPrompt = `${systemContext}\nUser Request: ${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ response: text });
  } catch (error) {
    console.error('Gemini Error:', error);
    return res.status(500).json({
      error: 'Failed to generate response',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
