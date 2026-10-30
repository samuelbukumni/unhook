import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.meta.ai/v1",
  apiKey: process.env.MODEL_API_KEY,
});

const schema = {
  type: "object",
  additionalProperties: false,
  required: [
    "service", "plan", "price", "currency",
    "billing_period", "trial_end_date", "first_charge_date", "notes",
  ],
  properties: {
    service: { type: "string" },
    plan: { type: ["string", "null"] },
    price: { type: ["number", "null"] },
    currency: { type: ["string", "null"] },
    billing_period: {
      type: "string",
      enum: ["weekly", "monthly", "yearly", "one_time", "unknown"],
    },
    trial_end_date: { type: ["string", "null"] },
    first_charge_date: { type: ["string", "null"] },
    notes: { type: "string" },
  },
};

export async function POST(request: Request) {
  const { text } = await request.json();
  if (typeof text !== "string" || !text.trim() || text.length > 8000) {
    return NextResponse.json(
      { error: "Send receipt text (max 8000 characters)." },
      { status: 400 },
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  try {
    const response = await client.responses.create({
      model: "muse-spark-1.3",
      instructions: `You extract subscription details from receipts and checkout text. Today's date is ${today}. Use YYYY-MM-DD for dates. If a trial length is given without dates, work out the dates from today. Use null when something is unknown. Never guess a price.`,
      input: text,
      text: {
        format: {
          type: "json_schema",
          name: "subscription",
          strict: true,
          schema,
        },
      },
    });
    return NextResponse.json(JSON.parse(response.output_text));
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Extraction failed." }, { status: 502 });
  }
}