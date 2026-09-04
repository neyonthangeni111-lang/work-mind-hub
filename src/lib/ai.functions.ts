import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  system: z.string().min(1),
  prompt: z.string().min(1),
});

export const runWorkmindAi = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      return { ok: false as const, status: 401, text: "", error: "AI is not configured for this workspace." };
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3.7-flash",
        messages: [
          { role: "system", content: data.system },
          { role: "user", content: data.prompt },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      let message = body;
      try {
        message = JSON.parse(body)?.error?.message ?? body;
      } catch {
        /* keep raw body */
      }
      if (res.status === 429) message = "Too many requests right now. Please wait a moment and try again.";
      if (res.status === 402) message = message || "AI credits are exhausted for this workspace.";
      return { ok: false as const, status: res.status, text: "", error: message };
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = json.choices?.[0]?.message?.content ?? "";
    return { ok: true as const, status: 200, text, error: "" };
  });
