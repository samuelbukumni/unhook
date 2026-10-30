// Cancel guides from data/cancel-guides.json, matched to a subscription by
// service name (case-insensitive; "+" counts as "plus", spaces and
// punctuation are ignored). Guides are unverified until marked verified.

import guides from "@/data/cancel-guides.json";

export type CancelGuide = {
  name: string;
  aliases: string[];
  cancel_url: string | null; // null when we couldn't confirm the official page
  steps: string[];
  verified: boolean;
};

const allGuides: CancelGuide[] = guides;

function normalize(name: string): string {
  return name.toLowerCase().replace(/\+/g, "plus").replace(/[^a-z0-9]/g, "");
}

/** The guide whose name or alias matches the service name, if any. */
export function findCancelGuide(service: string): CancelGuide | undefined {
  const key = normalize(service);
  if (!key) return undefined;
  return allGuides.find((guide) =>
    [guide.name, ...guide.aliases].some((name) => normalize(name) === key),
  );
}
