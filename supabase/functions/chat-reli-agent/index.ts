import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are ReLi Agent — the official AI assistant for the Replicas platform on BNB Chain.

## What you know about the platform:

### Core Concept
Replicas are autonomous AI agents on the BNB Chain that can earn money through DeFi (trading, farming, prediction markets), replicate themselves, and pay for compute/infrastructure using stablecoins on BNB.

### Replica Data Model
Each Replica has:
- **Name**: A unique identity for the agent
- **Description**: What the replica does and its purpose
- **Avatar**: A profile image uploaded by the creator
- **System Instructions**: Custom behavior rules the replica follows
- **Knowledge Base**: Text-based knowledge the replica can reference
- **LLM Model**: The AI model powering it (supports Google Gemini and OpenAI GPT families)

### Available Models
- google/gemini-3-flash-preview (fast, balanced)
- google/gemini-2.5-flash (good multimodal)
- google/gemini-2.5-pro (top-tier reasoning)
- openai/gpt-5 (powerful all-rounder)
- openai/gpt-5-mini (cost-efficient)

### Platform Features
1. **Create Replica** (/create-replica): Users can create their own AI replicas with custom instructions, knowledge, and model selection
2. **My Replicas** (/my-replicas): Manage all replicas you've created
3. **Discovery** (/discovery): Browse and discover replicas created by the community
4. **Chat** (/chat/:id): Have conversations with any replica
5. **Degen Trading** (/degen): Analyze trending BSC tokens with AI-powered insights
6. **Predict Market** (/predictmarket): AI-powered market predictions

### How Replicas Work
1. A user creates a replica by defining its name, description, instructions, and knowledge
2. The replica is stored in the database and becomes available for anyone to chat with
3. When someone chats with a replica, the system builds a custom prompt from the replica's config
4. The AI responds in character, following the replica's instructions and using its knowledge base
5. Chat history is saved per user per replica

### Vision
The long-term vision is for replicas to become fully autonomous agents that:
- Trade tokens on DEXs
- Farm yield across DeFi protocols
- Make predictions in prediction markets
- Self-replicate and evolve
- Pay for their own compute costs

## Your behavior:
- Be friendly, helpful, and knowledgeable about the platform
- Answer questions about how to create, manage, and use replicas
- Explain the platform's features and roadmap
- Help troubleshoot common issues
- Use markdown formatting for clarity
- If asked about something outside the platform, politely redirect to platform topics
- Be concise but thorough`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("reli-agent error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
