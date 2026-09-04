import { useCallback, useEffect, useState } from "react";

export type SavedCategory =
  | "Emails"
  | "Meeting summaries"
  | "Case summaries"
  | "Reports"
  | "Psychology insights"
  | "Conflict analyses"
  | "Task plans";

export type SavedOutput = {
  id: string;
  title: string;
  category: SavedCategory;
  caseRef: string;
  content: string;
  createdAt: string;
};

const KEY = "workmind.saved-outputs.v1";

function read(): SavedOutput[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedOutput[]) : [];
  } catch {
    return [];
  }
}

function write(items: SavedOutput[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("workmind-saved-changed"));
}

export function saveOutput(input: Omit<SavedOutput, "id" | "createdAt">) {
  const item: SavedOutput = {
    ...input,
    id: `SO-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  write([item, ...read()]);
  return item;
}

export function useSavedOutputs() {
  const [items, setItems] = useState<SavedOutput[]>([]);

  useEffect(() => {
    const sync = () => setItems(read());
    sync();
    window.addEventListener("workmind-saved-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("workmind-saved-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const remove = useCallback((id: string) => {
    write(read().filter((i) => i.id !== id));
  }, []);

  const rename = useCallback((id: string, title: string) => {
    write(read().map((i) => (i.id === id ? { ...i, title } : i)));
  }, []);

  return { items, remove, rename };
}
