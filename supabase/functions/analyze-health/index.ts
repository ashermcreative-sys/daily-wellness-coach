import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { today_entries, recent_daily_summaries } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log('Analyzing health data for date:', today_entries?.morning?.date || 'unknown');

    const systemPrompt = `You are a supportive but realistic health & wellbeing coach.
The user logs subjective data on mood, stress, energy, sleep, and body sensations three times per day (morning, midday, night) along with diary-style notes.

Your job is to:
1. Analyse today's three entries in the context of the recent history (last week or so).
2. Produce three readiness scores, each in the range 0–100:
   - mind_readiness – how mentally and emotionally ready the user is (mood, stress, focus, motivation).
   - body_readiness – how physically ready the user is (sleep, pain, fatigue, activity).
   - overall_readiness – overall daily wellbeing, combining mind and body.
3. Write a short, human-readable summary_text for the day (3–5 sentences).
4. Identify highlights in what_went_well as a list of bullet points.
5. Identify issues or trends to watch in concerns as bullet points.
6. Suggest 1–3 small, realistic actions for tomorrow in suggested_actions as bullet points.

Be gentle, practical, and specific.
Avoid any medical diagnoses. You are not a doctor and this app is not a medical device.
If you see patterns that could indicate serious, persistent, or worsening issues (physical or mental), you may gently suggest that the user consider speaking to a healthcare professional or mental health professional.

Output MUST be valid JSON only, with no extra text.`;

    const userPrompt = JSON.stringify({
      today_entries,
      recent_daily_summaries: recent_daily_summaries || []
    });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_health_insights",
              description: "Generate daily health readiness scores and insights",
              parameters: {
                type: "object",
                properties: {
                  mind_readiness: { 
                    type: "number",
                    description: "Mental readiness score from 0-100"
                  },
                  body_readiness: { 
                    type: "number",
                    description: "Physical readiness score from 0-100"
                  },
                  overall_readiness: { 
                    type: "number",
                    description: "Overall readiness score from 0-100"
                  },
                  summary_text: { 
                    type: "string",
                    description: "3-5 sentence summary of the day"
                  },
                  what_went_well: { 
                    type: "string",
                    description: "Bullet points of positive highlights"
                  },
                  concerns: { 
                    type: "string",
                    description: "Bullet points of concerns or trends to watch"
                  },
                  suggested_actions: { 
                    type: "string",
                    description: "1-3 concrete actions for tomorrow"
                  }
                },
                required: [
                  "mind_readiness",
                  "body_readiness",
                  "overall_readiness",
                  "summary_text",
                  "what_went_well",
                  "concerns",
                  "suggested_actions"
                ],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_health_insights" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');
    
    // Extract the function call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const result = JSON.parse(toolCall.function.arguments);
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-health function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});