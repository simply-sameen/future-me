import "jsr:@supabase/functions-js/edge-runtime.d.ts"
// Made by Sameen Sardar
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
}

interface CoachRequest {
  goalTitle: string
  goalDescription: string
  subGoals: Array<{
    title: string
    estimatedDays: number
  }>
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const { goalTitle, goalDescription, subGoals }: CoachRequest = await req.json()

    if (!goalTitle || !subGoals) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: goalTitle, subGoals" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY")
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "AI Coach service not configured" }),
        {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    const subGoalsList = subGoals
      .map(
        (sg, idx) =>
          `${idx + 1}. ${sg.title} (~${sg.estimatedDays} days)`
      )
      .join("\n")

    const prompt = `You are an expert goal achievement coach. Analyze this goal and provide specific, actionable advice focused purely on how to improve completion timing:

Goal: ${goalTitle}
Description: ${goalDescription}

Sub-goals breakdown:
${subGoalsList}

Please provide 2-3 short, actionable paragraphs of advice focused strongly on how to optimize the execution timeline, avoid common pitfalls that delay progress, and sequence these specific steps effectively to complete the goal faster. Keep it tactical and direct.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
            maxOutputTokens: 512,
          },
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error("Gemini API error:", error)
      return new Response(
        JSON.stringify({
          error: "Failed to generate coaching advice",
          details: error.error?.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    const data = await response.json()
    const advice = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!advice) {
      return new Response(
        JSON.stringify({ error: "No advice generated" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        advice,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  } catch (error) {
    console.error("Error:", error)
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }
})
