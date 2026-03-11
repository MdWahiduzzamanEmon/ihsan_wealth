import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage, SystemMessage, type BaseMessage } from "@langchain/core/messages";
import { createServerSupabase } from "@/lib/supabase/server";
import { buildSystemPrompt } from "@/lib/chat/system-prompt";
import { createSupabaseTools, createMetalPriceTool } from "@/lib/chat/tools";
import { OPENROUTER_API_URL, OPENROUTER_MODEL } from "@/lib/chat/constants";
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

  const { messages, feature, language, zakatSummary } = body;
  if (!messages?.length || !feature) {
    return NextResponse.json({ error: "Missing messages or feature" }, { status: 400 });
  }

  // Get authenticated user from Supabase
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

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
    maxTokens: 1500,
    streaming: false,
  });

  // Build tools — metal prices for everyone, Supabase tools for authenticated users
  const origin = new URL(request.url).origin;
  const metalTool = createMetalPriceTool(origin);
  const supabaseTools = user ? createSupabaseTools(supabase, user.id) : [];
  const tools = [metalTool, ...supabaseTools];

  let modelWithTools = model;
  let toolCallSupported = false;

  try {
    modelWithTools = model.bindTools(tools) as typeof model;
    toolCallSupported = true;
  } catch {
    // Model doesn't support tool calling — will use fallback
  }

  // Resolve the user's preferred currency from their language
  const userCurrency = LANG_TO_CURRENCY[language] || "USD";

  // Detect query types for fallback (when tool calling not supported)
  const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
  const isPersonalQuery = /\b(my|history|record|payment|sadaqah|summary|paid|owe|due|how much)\b/i.test(lastUserMsg);
  const isMetalQuery = /\b(gold|silver|nisab|price|rate|metal|tola|gram|ounce|সোনা|রূপা|سونا|چاندی|ذهب|فضة|altın|gümüş|emas|perak)\b/i.test(lastUserMsg);

  // Fallback: pre-fetch data and inject into system prompt when tool calling is not available
  let dataContext = "";
  if (!toolCallSupported) {
    const parts: string[] = [];

    // Fetch metal prices if asked — use the user's local currency
    if (isMetalQuery) {
      try {
        const metalRes = await metalTool.invoke({ currency: userCurrency });
        if (metalRes) parts.push(`Live Metal Prices:\n${metalRes}`);
      } catch { /* ignore */ }
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
  const toolInstructions = toolCallSupported
    ? `\n\nYou have access to tools: get_live_metal_prices (fetch current gold/silver prices and nisab), ` +
      (user ? "get_zakat_records, get_zakat_payments, get_sadaqah_records, get_user_summary (query user's database). " : "") +
      `When calling get_live_metal_prices, ALWAYS use currency="${userCurrency}" (the user's local currency). ` +
      "Use tools when the user asks about current prices, nisab values, their history, or personal data. ALWAYS use tools for real data — never make up numbers."
    : dataContext;

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

        // Tool-calling loop: use invoke() so we can inspect tool_calls
        let didStream = false;

        while (iterations < MAX_ITERATIONS) {
          iterations++;

          let response;
          try {
            response = await modelWithTools.invoke(currentMessages);
          } catch (invokeErr) {
            // If tool-bound model fails (model doesn't support tools), retry without tools
            if (toolCallSupported && iterations === 1) {
              toolCallSupported = false;
              response = await model.invoke(currentMessages);
            } else {
              throw invokeErr;
            }
          }

          // Extract any text content from the response
          const extractText = () => {
            if (typeof response.content === "string") return response.content;
            if (Array.isArray(response.content)) {
              return response.content
                .map((c) => (typeof c === "string" ? c : "text" in c ? (c as { text: string }).text : ""))
                .join("");
            }
            return "";
          };

          const toolCalls = response.tool_calls;
          if (toolCallSupported && toolCalls && toolCalls.length > 0 && tools.length > 0) {
            currentMessages.push(response);

            for (const tc of toolCalls) {
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

          // No tool calls — stream the text
          const finalText = extractText();

          if (finalText.trim()) {
            const CHUNK = 12;
            for (let i = 0; i < finalText.length; i += CHUNK) {
              const chunk = finalText.slice(i, i + CHUNK);
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
              await new Promise((r) => setTimeout(r, 15));
            }
            didStream = true;
          }
          break;
        }

        // If we exhausted iterations or got empty response, send a fallback message
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
