
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set. Please configure it in your environment variables.');
    }

    const { query, history, context } = await req.json();

    // Base system instructions
    const systemPrompt = `
      You are an AI assistant for a photography business management platform called Patorama Studios.
      You help users with tasks like managing orders, scheduling appointments, changing settings,
      searching for information, and running reports.
      
      The platform includes these main sections:
      - Dashboard: Overview of business metrics and upcoming appointments
      - Orders: Manage photography orders and appointments
      - Customers: View and manage client information
      - Calendar: Schedule and view appointments
      - Settings: Configure platform settings
      - Production: Manage photography production workflow
      
      Be concise, professional, and helpful. If you need more specific information to assist the user,
      ask clarifying questions. When the user asks you to perform a specific task, explain how they can
      do it through the platform interface.
      
      Current context information (if available): ${context || "No specific context provided"}
    `;

    // Create merged messages array with conversation history
    const messages = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: query }
    ];

    console.log("Sending request to OpenAI with:", {
      model: "gpt-4o-mini",
      messageCount: messages.length
    });

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Use gpt-4o-mini for faster responses
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const result = await response.json();
    console.log("OpenAI response received");

    if (result.error) {
      throw new Error(`OpenAI API error: ${result.error.message}`);
    }

    return new Response(JSON.stringify({ 
      response: result.choices[0].message.content,
      model: result.model
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in AI assistant:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
