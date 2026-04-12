import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Chat API handler — STATELESS per request.
 *
 * Session isolation guarantees:
 * - A fresh GoogleGenerativeAI client and model are created on EVERY request.
 * - No global variables, caches, or module-level state are used.
 * - Multi-turn context is derived ONLY from the `history` array and
 *   `goalsData`/`remindersData` explicitly passed in the POST body.
 * - This ensures one user's conversation can never bleed into another's.
 */
export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    return res.status(200).send('ok');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, history, goalsData, remindersData, mode } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: 'Missing required field: prompt' });
    }

    // Fresh instance per request — no shared state between calls
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: 'AI service not configured' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    let systemContext: string;
    if (mode === 'deconstruct') {
      systemContext = `You are a master planner and goal deconstructor. Break the user's goal into exactly 5 actionable sub-goals. You MUST respect the user's target date — do NOT use a generic 90-day timeline. Calculate realistic estimated days for each sub-goal that fit within the target date. Respond ONLY in valid JSON with this exact schema: { "subGoals": [{ "title": "string", "estimatedDays": number }], "totalDays": number }. Do not include any explanation, markdown, or text outside the JSON object.`;
    } else {
      systemContext = `You are the Future Me Productivity Coach. You help users break down tasks and manage time. The user currently has the following active goals: ${goalsData || 'None'} and scheduled reminders: ${remindersData || 'None'}. Use this context to give highly specific, actionable advice. Keep responses concise and motivating.`;
    }

    // Build chat history from the client-provided array (stateless reconstruction)
    const chatHistory = (mode === 'deconstruct') ? [] : (Array.isArray(history)
      ? history.map((msg: { role: string; content: string }) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        }))
      : []);

    const chat = model.startChat({
      history: [
        // Inject system context as the first exchange
        { role: 'user', parts: [{ text: `System instructions: ${systemContext}` }] },
        { role: 'model', parts: [{ text: mode === 'deconstruct' ? 'Understood. I will respond with valid JSON only.' : 'Understood. I\'m your Future Me Productivity Coach. I\'ll use your goals and reminders to provide specific, actionable advice. How can I help?' }] },
        ...chatHistory,
      ],
    });

    const result = await chat.sendMessage(prompt);
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
