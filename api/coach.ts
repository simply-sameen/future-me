import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    return res.status(200).send('ok');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { goalTitle, goalDescription, subGoals } = req.body || {};

    if (!goalTitle) {
      return res.status(400).json({ error: 'Missing required field: goalTitle' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: 'AI service not configured' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const subGoalsList = subGoals && subGoals.length > 0
      ? subGoals.map((sg: any, idx: number) => `${idx + 1}. ${sg.title} (~${sg.estimatedDays} days)`).join("\n")
      : "No sub-goals defined.";

    const fullPrompt = `You are an expert goal achievement coach. Analyze this goal and provide specific, actionable advice focused purely on how to improve completion timing:

Goal: ${goalTitle}
Description: ${goalDescription || 'None provided'}

Sub-goals breakdown:
${subGoalsList}

Please provide 2-3 short, actionable paragraphs of advice focused strongly on how to optimize the execution timeline, avoid common pitfalls that delay progress, and sequence these specific steps effectively to complete the goal faster. Keep it tactical and direct.`;

    const result = await model.generateContent(fullPrompt);
    const apiResponse = await result.response;
    const text = apiResponse.text();

    return res.status(200).json({ advice: text });
  } catch (error) {
    console.error('Coach API Error:', error);
    return res.status(500).json({
      error: 'Failed to generate coaching advice',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
