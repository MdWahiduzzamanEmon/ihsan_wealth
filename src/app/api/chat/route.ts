import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage, SystemMessage, type BaseMessage } from "@langchain/core/messages";
import { createClient } from "@supabase/supabase-js";
import { buildSystemPrompt } from "@/lib/chat/system-prompt";
import { createSupabaseTools, createMetalPriceTool } from "@/lib/chat/tools";
import { OPENROUTER_MODEL } from "@/lib/chat/constants";
import type { ChatFeature } from "@/types/chat";

// Map user's language to their most likely local currency
const LANG_TO_CURRENCY: Record<string, string> = {
  en: "USD",
  bn: "BDT",
  ur: "PKR",
  ar: "SAR",
  tr: "TRY",
  ms: "MYR",
  id: "IDR",
};

interface RequestBody {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  feature: ChatFeature;
  language: string;
  zakatSummary?: string;
  metalPricesContext?: string;
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 500 });
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { messages, feature, language, zakatSummary, metalPricesContext } = body;
  if (!messages?.length || !feature) {
    return NextResponse.json({ error: "Missing messages or feature" }, { status: 400 });
  }

  // Get authenticated user from access token sent by the frontend
  const authHeader = request.headers.get("Authorization");
  const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    accessToken
      ? { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
      : undefined,
  );

  const { data: { user } } = await supabase.auth.getUser(accessToken || undefined);

  // Build system prompt
  const systemPrompt = buildSystemPrompt(feature, language, zakatSummary);

  // Create LangChain model via OpenRouter (OpenAI-compatible)
  const model = new ChatOpenAI({
    modelName: OPENROUTER_MODEL,
    apiKey,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "https://ihsanwealth.onrender.com",
        "X-Title": "IhsanWealth AI Assistant",
      },
    },
    temperature: 0.4,
    maxTokens: 3000,
    streaming: false,
  });

  // Build tools — only Supabase tools (metal prices are pre-fetched from the client)
  const supabaseTools = user ? createSupabaseTools(supabase, user.id) : [];
  // Include metal price tool only as fallback when client didn't send prices
  const origin = new URL(request.url).origin;
  const metalTool = metalPricesContext ? null : createMetalPriceTool(origin);
  const tools = [...(metalTool ? [metalTool] : []), ...supabaseTools];

  let modelWithTools = model;
  let toolCallSupported = false;

  if (tools.length > 0) {
    try {
      modelWithTools = model.bindTools(tools) as typeof model;
      toolCallSupported = true;
    } catch {
      // Model doesn't support tool calling — will use fallback
    }
  }

  // Resolve the user's preferred currency from their language
  const userCurrency = LANG_TO_CURRENCY[language] || "BDT";

  // Detect query types for fallback (when tool calling not supported)
  const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
  const isPersonalQuery = /\b(my|history|record|payment|sadaqah|summary|paid|owe|due|how much|salat|namaz|namaj|prayer|streak|tasbih|dhikr|ramadan|fasting|qaza)\b|নামাজ|নামায|তাসবীহ|যাকাত|সদকা|রোজা|রমজান|نماز|تسبیح|زکات|صدقہ|روزہ|صلاة|زكاة|صدقة|تسبيح|صيام/i.test(lastUserMsg);
  const isMetalQuery = /\b(gold|silver|nisab|price|rate|metal|tola|gram|ounce|সোনা|রূপা|سونا|چاندی|ذهب|فضة|altın|gümüş|emas|perak)\b/i.test(lastUserMsg);

  // Fallback: pre-fetch data and inject into system prompt when tool calling is not available
  let dataContext = "";
  if (!toolCallSupported) {
    const parts: string[] = [];

    // Inject pre-fetched metal prices or invoke the tool as fallback
    if (isMetalQuery) {
      if (metalPricesContext) {
        parts.push(`Live Metal Prices:\n${metalPricesContext}`);
      } else if (metalTool) {
        try {
          const metalRes = await metalTool.invoke({ currency: userCurrency });
          if (metalRes) parts.push(`Live Metal Prices:\n${metalRes}`);
        } catch { /* ignore */ }
      }
    }

    // Fetch user data if authenticated and asking personal questions
    if (user && isPersonalQuery) {
      try {
        const [zakatRes, paymentRes, sadaqahRes] = await Promise.all([
          supabaseTools.find(t => t.name === "get_zakat_records")?.invoke({ }),
          supabaseTools.find(t => t.name === "get_zakat_payments")?.invoke({ }),
          supabaseTools.find(t => t.name === "get_sadaqah_records")?.invoke({ }),
        ]);
        if (zakatRes && zakatRes !== "No zakat records found.") parts.push(`Zakat Records:\n${zakatRes}`);
        if (paymentRes && !paymentRes.toString().startsWith("No ")) parts.push(`Payment History:\n${paymentRes}`);
        if (sadaqahRes && sadaqahRes !== "No sadaqah records found.") parts.push(`Sadaqah Records:\n${sadaqahRes}`);
        if (!parts.some(p => p.startsWith("Zakat") || p.startsWith("Payment") || p.startsWith("Sadaqah"))) {
          parts.push("The user has no saved records yet. Let them know they can use the Zakat Calculator to calculate and save their zakat, and the Sadaqah Tracker to log voluntary charity.");
        }
      } catch { /* ignore */ }
    }

    if (parts.length) {
      dataContext = `\n\n## Live Data (fetched just now — use this to answer):\n${parts.join("\n\n")}`;
    }
  }

  // Build LangChain messages
  const metalPricesNote = metalPricesContext
    ? `\n\n## Current Metal Prices (already fetched — use this directly, do NOT call any price tool):\n${metalPricesContext}`
    : "";

  let toolInstructions = metalPricesNote;
  if (toolCallSupported) {
    const toolNames: string[] = [];
    if (metalTool) toolNames.push(`get_live_metal_prices (use currency="${userCurrency}")`);
    if (supabaseTools.length > 0) toolNames.push("get_zakat_records, get_zakat_payments, get_sadaqah_records, get_user_summary, get_tasbih_sessions, get_salat_records, get_ramadan_progress");
    if (toolNames.length > 0) {
      toolInstructions += `\n\nYou have access to tools: ${toolNames.join(", ")}. Use them for real data — never make up numbers.`;
    }
  } else {
    toolInstructions += dataContext;
  }

  const authContext = user
    ? "\n\nThe user is logged in." + toolInstructions
    : "\n\nThe user is not logged in. If they ask about their history or records, tell them to sign in first." + toolInstructions;

  const lcMessages = [
    new SystemMessage(systemPrompt + authContext),
    ...messages.slice(-20).map((m) =>
      m.role === "user" ? new HumanMessage(m.content) : new AIMessage(m.content),
    ),
  ];

  // Stream the response
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Run with tool calling loop (max 3 iterations for tool calls)
        let currentMessages: BaseMessage[] = [...lcMessages];
        let iterations = 0;
        const MAX_ITERATIONS = 3;

        // Helper to stream text to the client
        const streamText = async (text: string) => {
          const CHUNK = 12;
          for (let i = 0; i < text.length; i += CHUNK) {
            const chunk = text.slice(i, i + CHUNK);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
            await new Promise((r) => setTimeout(r, 15));
          }
        };

        // Helper to extract text from a response
        const extractText = (response: { content: string | Array<unknown> }) => {
          if (typeof response.content === "string") return response.content;
          if (Array.isArray(response.content)) {
            return response.content
              .map((c) => (typeof c === "string" ? c : c && typeof c === "object" && "text" in c ? (c as { text: string }).text : ""))
              .join("");
          }
          return "";
        };

        // Tool-calling loop: use invoke() so we can inspect tool_calls
        let didStream = false;

        while (iterations < MAX_ITERATIONS) {
          iterations++;

          let response;
          try {
            response = await modelWithTools.invoke(currentMessages);
          } catch (invokeErr) {
            // If tool-bound model fails, retry without tools
            if (toolCallSupported && iterations === 1) {
              toolCallSupported = false;
              response = await model.invoke(currentMessages);
            } else {
              throw invokeErr;
            }
          }

          const toolCalls = response.tool_calls;
          const hasToolCalls = toolCallSupported && toolCalls && toolCalls.length > 0 && tools.length > 0;

          // Process tool calls first — even if the model sent partial text alongside,
          // defer streaming until tool results are available so the final response is complete.
          if (hasToolCalls) {
            currentMessages.push(response);

            for (const tc of toolCalls!) {
              const matchedTool = tools.find((t) => t.name === tc.name);
              if (matchedTool) {
                try {
                  const toolResult = await (matchedTool as { invoke: (args: Record<string, unknown>) => Promise<string> }).invoke(tc.args);
                  const { ToolMessage } = await import("@langchain/core/messages");
                  currentMessages.push(
                    new ToolMessage({
                      content: typeof toolResult === "string" ? toolResult : JSON.stringify(toolResult),
                      tool_call_id: tc.id || "",
                    }),
                  );
                } catch {
                  const { ToolMessage } = await import("@langchain/core/messages");
                  currentMessages.push(
                    new ToolMessage({
                      content: "Tool call failed. Please answer based on your knowledge.",
                      tool_call_id: tc.id || "",
                    }),
                  );
                }
              }
            }
            continue;
          }

          // No tool calls — stream any text content and finish
          const responseText = extractText(response);
          if (responseText.trim()) {
            await streamText(responseText);
            didStream = true;
          }
          break;
        }

        // If loop exhausted without streaming, do a final plain-model call as last resort
        if (!didStream) {
          try {
            const fallbackResponse = await model.invoke(currentMessages);
            const fallbackText = extractText(fallbackResponse);
            if (fallbackText.trim()) {
              await streamText(fallbackText);
              didStream = true;
            }
          } catch {
            // Ignore — will show fallback message below
          }
        }

        if (!didStream) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: "I apologize, I was unable to generate a response. Please try again or rephrase your question." })}\n\n`));
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        console.error("Chat API error:", errorMsg);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: `Sorry, something went wrong: ${errorMsg}. Please try again.` })}\n\n`));
      } finally {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
