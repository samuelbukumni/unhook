// Client helper for POST /api/extract, which turns pasted receipt text into
// subscription details. The response type mirrors the route's JSON schema.

export type ExtractResult = {
  service: string;
  plan: string | null;
  price: number | null;
  currency: string | null;
  billing_period: "weekly" | "monthly" | "yearly" | "one_time" | "unknown";
  trial_end_date: string | null;
  first_charge_date: string | null;
  notes: string;
};

export const MAX_RECEIPT_LENGTH = 8000; // the route rejects longer text

/** Sends receipt text to the route. Throws an Error with a readable message. */
export async function extractFromText(text: string): Promise<ExtractResult> {
  let response: Response;
  try {
    response = await fetch("/api/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch {
    throw new Error("Couldn't reach the server. Check your connection and try again.");
  }

  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      data && typeof data === "object" && "error" in data && typeof data.error === "string"
        ? data.error
        : `Extraction failed (HTTP ${response.status}).`;
    throw new Error(message);
  }
  if (!data || typeof data !== "object" || typeof (data as ExtractResult).service !== "string") {
    throw new Error("The extraction came back in an unexpected shape.");
  }
  return data as ExtractResult;
}
