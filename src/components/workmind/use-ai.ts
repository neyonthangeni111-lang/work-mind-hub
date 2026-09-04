import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { runWorkmindAi } from "@/lib/ai.functions";

export function useAi() {
  const call = useServerFn(runWorkmindAi);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  async function generate(system: string, prompt: string) {
    setLoading(true);
    try {
      const res = await call({ data: { system, prompt } });
      if (!res.ok) {
        toast.error(res.error || "The AI request could not be completed.");
        return;
      }
      setOutput(res.text);
    } catch {
      toast.error("The AI request could not be completed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return { loading, output, setOutput, generate };
}
