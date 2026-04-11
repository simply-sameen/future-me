const GOOGLE_AI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const FREE_PLAN_LIMITS = {
  monthlyTokenLimit: 1500000,
  requestsPerMinute: 15,
}

export interface GoalDecomposition {
  title: string
  description: string
  steps: Array<{
    title: string
    description: string
    estimatedDays: number
  }>
}

export async function decomposeGoalWithAI(
  goalTitle: string,
  goalDescription: string,
  apiKey: string
): Promise<GoalDecomposition> {
  const prompt = `You are an expert life coach and strategic planner. Break down this large goal into 5 specific, actionable, and measurable sub-goals.

Goal: ${goalTitle}
Context: ${goalDescription}

For each sub-goal, provide:
1. A clear, specific title
2. A brief description of what needs to be done
3. An estimated number of days to complete it

Format your response as JSON with this structure:
{
  "title": "The main goal",
  "description": "A brief description",
  "steps": [
    {
      "title": "Step 1 title",
      "description": "Step 1 description",
      "estimatedDays": 7
    }
  ]
}

Ensure the total estimated days is around 90 days. Make the steps progressively build on each other.`

  try {
    const response = await fetch(`${GOOGLE_AI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Gemini API Error: ${error.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!textContent) {
      throw new Error('No response from Gemini API')
    }

    const jsonMatch = textContent.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not parse AI response')
    }

    const decomposition = JSON.parse(jsonMatch[0]) as GoalDecomposition
    return decomposition
  } catch (error) {
    throw new Error(`Failed to decompose goal: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export function getFreePlanLimits() {
  return FREE_PLAN_LIMITS
}

export function estimateTokenUsage(text: string): number {
  return Math.ceil(text.length / 4)
}
