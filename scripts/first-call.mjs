import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.meta.ai/v1",
  apiKey: process.env.MODEL_API_KEY,
});

const receipt = `
From: billing@designly-app.ecode .envxample
Subject: Your Designly Pro free trial has started

Hi there, your 7-day free trial of Designly Pro began on Oct 28, 2026.
Unless you cancel before Nov 4, 2026, your card will be charged $12.99
per month, starting Nov 4, 2026, and every month after that.
`;

const response = await client.responses.create({
  model: "muse-spark-1.3",
  input: `Extract the subscription details from this receipt email. Reply with JSON only, using exactly these keys: service, plan, price, currency, billing_period, trial_end_date, first_charge_date, notes. Use YYYY-MM-DD for dates and null if unknown.\n\n${receipt}`,
});

console.log(response.output_text);