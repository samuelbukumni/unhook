// 20 fake receipts and checkout texts for testing POST /api/extract later.
// Every service, address, and domain here is made up (.example domains).
//
// Conventions for `expected` (same shape the route returns):
// - price: the amount charged per billing period on this receipt (incl. tax).
// - first_charge_date: the charge this receipt is about, or for a trial the
//   first charge after the trial. null when the text doesn't say.
// - Unknown values are null; periods outside weekly/monthly/yearly are "unknown".
// - notes is free text from the model, so compare it loosely (e.g. check that
//   it mentions the words in `noteHints`); compare every other field exactly.
// All dates are written out in the text, so results don't depend on today.

import type { ExtractResult } from "./extraction";

export type TestReceipt = {
  id: string;
  label: string;
  text: string;
  expected: ExtractResult;
  noteHints: string[];
};

export const testReceipts: TestReceipt[] = [
  {
    id: "monthly-basic",
    label: "Plain monthly receipt (USD)",
    text: `From: billing@streamnest.example
Subject: Your StreamNest receipt

Thanks for your payment!
Plan: Basic
Amount: $9.99
Billing period: Monthly
Charged on: October 5, 2026
StreamNest Inc., 100 Example Way, Springfield`,
    expected: {
      service: "StreamNest", plan: "Basic", price: 9.99, currency: "USD",
      billing_period: "monthly", trial_end_date: null, first_charge_date: "2026-10-05", notes: "",
    },
    noteHints: [],
  },
  {
    id: "annual-storage",
    label: "Annual plan",
    text: `CloudCrate — Order confirmation
Order #CC-48213
Item: CloudCrate 1 TB (billed yearly)
Total: USD 79.00
Payment date: 2026-03-14
Your plan renews automatically on 2027-03-14.
support@cloudcrate.example`,
    expected: {
      service: "CloudCrate", plan: "1 TB", price: 79, currency: "USD",
      billing_period: "yearly", trial_end_date: null, first_charge_date: "2026-03-14", notes: "",
    },
    noteHints: ["2027-03-14"],
  },
  {
    id: "weekly-news",
    label: "Weekly billing",
    text: `DailyBrief digital access — receipt
You were charged $2.99 on Oct 26, 2026 for 1 week of Digital Access.
Next charge: Nov 2, 2026.
Manage at account.dailybrief.example`,
    expected: {
      service: "DailyBrief", plan: "Digital Access", price: 2.99, currency: "USD",
      billing_period: "weekly", trial_end_date: null, first_charge_date: "2026-10-26", notes: "",
    },
    noteHints: [],
  },
  {
    id: "trial-to-monthly",
    label: "Free trial then monthly",
    text: `Welcome to Pixelpad Pro!
Your 14-day free trial started on October 20, 2026 and ends on November 3, 2026.
After your trial, you'll be charged $14.99/month starting November 3, 2026, unless you cancel.
Pixelpad, 42 Sample Street, Testville — hello@pixelpad.example`,
    expected: {
      service: "Pixelpad", plan: "Pro", price: 14.99, currency: "USD",
      billing_period: "monthly", trial_end_date: "2026-11-03", first_charge_date: "2026-11-03", notes: "",
    },
    noteHints: ["trial"],
  },
  {
    id: "trial-to-annual",
    label: "Free trial then yearly",
    text: `FitLoop Premium — trial confirmation
Trial: 7 days, free
Trial ends: 2026-11-06
Then: $59.99 per year, first payment on 2026-11-06
Cancel anytime in the FitLoop app or at fitloop.example/account`,
    expected: {
      service: "FitLoop", plan: "Premium", price: 59.99, currency: "USD",
      billing_period: "yearly", trial_end_date: "2026-11-06", first_charge_date: "2026-11-06", notes: "",
    },
    noteHints: ["trial"],
  },
  {
    id: "price-hike-monthly",
    label: "Price increase notice (monthly)",
    text: `An update to your MusicMesh Family plan
Hi there, starting with your bill on December 1, 2026, the price of MusicMesh Family
will change from $16.99/month to $19.99/month. You don't need to do anything to keep listening.
MusicMesh, 9 Placeholder Ave — musicmesh.example/help`,
    expected: {
      service: "MusicMesh", plan: "Family", price: 19.99, currency: "USD",
      billing_period: "monthly", trial_end_date: null, first_charge_date: "2026-12-01", notes: "",
    },
    noteHints: ["16.99", "19.99"],
  },
  {
    id: "price-hike-annual-eur",
    label: "Price increase notice (yearly, EUR)",
    text: `Your SafeVault Plus renewal
Your subscription renews on 15 January 2027 at €119.00 per year (previously €99.00).
Questions? Write to care@safevault.example`,
    expected: {
      service: "SafeVault", plan: "Plus", price: 119, currency: "EUR",
      billing_period: "yearly", trial_end_date: null, first_charge_date: "2027-01-15", notes: "",
    },
    noteHints: ["99"],
  },
  {
    id: "naira-monthly",
    label: "Naira amount with ₦ symbol",
    text: `TuneCity Naija — payment successful
Plan: Individual (monthly)
Amount paid: ₦4,500.00
Date: 12/10/2026 (DD/MM/YYYY)
Ref: TCN-77120 · tunecity.example`,
    expected: {
      service: "TuneCity Naija", plan: "Individual", price: 4500, currency: "NGN",
      billing_period: "monthly", trial_end_date: null, first_charge_date: "2026-10-12", notes: "",
    },
    noteHints: [],
  },
  {
    id: "gbp-vat",
    label: "GBP price including VAT",
    text: `ReadMore Unlimited
£7.99 per month (inc. VAT)
Paid 2 October 2026 with Visa ending 0000
ReadMore Ltd, 1 Fake Lane, London — readmore.example`,
    expected: {
      service: "ReadMore", plan: "Unlimited", price: 7.99, currency: "GBP",
      billing_period: "monthly", trial_end_date: null, first_charge_date: "2026-10-02", notes: "",
    },
    noteHints: [],
  },
  {
    id: "sms-caps",
    label: "All-caps SMS style",
    text: `QUIZLY: UR QUIZLY PREMIUM SUB RENEWED 29/10/2026. AMT USD 4.99/MTH. NEXT BILL 29/11/2026. TO STOP VISIT QUIZLY.EXAMPLE/STOP`,
    expected: {
      service: "Quizly", plan: "Premium", price: 4.99, currency: "USD",
      billing_period: "monthly", trial_end_date: null, first_charge_date: "2026-10-29", notes: "",
    },
    noteHints: [],
  },
  {
    id: "german-format",
    label: "German text, comma decimals, DD.MM.YYYY",
    text: `LernFix – Zahlungsbestätigung
Tarif: Plus
Betrag: 12,99 € monatlich
Datum: 03.10.2026
LernFix GmbH, Beispielstraße 1, Musterstadt · lernfix.example`,
    expected: {
      service: "LernFix", plan: "Plus", price: 12.99, currency: "EUR",
      billing_period: "monthly", trial_end_date: null, first_charge_date: "2026-10-03", notes: "",
    },
    noteHints: [],
  },
  {
    id: "itemized-tax",
    label: "Itemized receipt with tax lines",
    text: `INVOICE  #INV-2026-1044      DeskFlow
Bill to: Sample Customer, 5 Demo Road
-------------------------------------------
DeskFlow Team (monthly)         $20.00
Sales tax (7.5%)                 $1.50
-------------------------------------------
TOTAL CHARGED                   $21.50
Invoice date: 2026-10-18
deskflow.example/billing`,
    expected: {
      service: "DeskFlow", plan: "Team", price: 21.5, currency: "USD",
      billing_period: "monthly", trial_end_date: null, first_charge_date: "2026-10-18", notes: "",
    },
    noteHints: ["tax"],
  },
  {
    id: "one-time",
    label: "One-time purchase (not a subscription)",
    text: `Thanks for buying FontForge Studio!
License: Lifetime
Price: $49.00 (one-time payment, no renewals)
Purchased: September 9, 2026
Download at fontforge.example/downloads`,
    expected: {
      service: "FontForge Studio", plan: "Lifetime", price: 49, currency: "USD",
      billing_period: "one_time", trial_end_date: null, first_charge_date: "2026-09-09", notes: "",
    },
    noteHints: ["one-time"],
  },
  {
    id: "unknown-period",
    label: "Payment with no billing period",
    text: `Payment received
Thank you for your payment of $12.00 to WidgetHub on 2026-10-21.
Receipt ID: WH-55031. Questions: help@widgethub.example`,
    expected: {
      service: "WidgetHub", plan: null, price: 12, currency: "USD",
      billing_period: "unknown", trial_end_date: null, first_charge_date: "2026-10-21", notes: "",
    },
    noteHints: [],
  },
  {
    id: "trial-no-price",
    label: "Trial with no price stated",
    text: `Your NoteNest Plus free trial has started!
It ends on 2026-11-12. After that you'll be billed monthly at the current plan price.
Manage your plan at notenest.example/settings`,
    expected: {
      service: "NoteNest", plan: "Plus", price: null, currency: null,
      billing_period: "monthly", trial_end_date: "2026-11-12", first_charge_date: "2026-11-12", notes: "",
    },
    noteHints: ["price"],
  },
  {
    id: "app-store-style",
    label: "App store style receipt",
    text: `AppMarket Receipt
Purchase date: 15 Oct 2026
SleepWell: Sleep Sounds
SleepWell Premium (Monthly)        $5.99
Renews 15 Nov 2026
Billed to the payment method on file. appmarket.example/subscriptions`,
    expected: {
      service: "SleepWell", plan: "Premium", price: 5.99, currency: "USD",
      billing_period: "monthly", trial_end_date: null, first_charge_date: "2026-10-15", notes: "",
    },
    noteHints: [],
  },
  {
    id: "checkout-page",
    label: "Checkout page text, not an email",
    text: `VidSnip — Choose your plan
Creator plan  ·  Start your 30-day free trial
Then $8/mo. Trial ends December 1, 2026. Cancel anytime before then and you won't be charged.
[ Start free trial ]   Terms · Privacy · vidsnip.example`,
    expected: {
      service: "VidSnip", plan: "Creator", price: 8, currency: "USD",
      billing_period: "monthly", trial_end_date: "2026-12-01", first_charge_date: "2026-12-01", notes: "",
    },
    noteHints: ["trial"],
  },
  {
    id: "quarterly",
    label: "Quarterly billing (not a supported period)",
    text: `GymPal Pro 💪 — membership confirmation
You'll be billed $24.00 every 3 months.
First payment taken: 2026-10-01
Member ID GP-0042 · gympal.example`,
    expected: {
      service: "GymPal", plan: "Pro", price: 24, currency: "USD",
      billing_period: "unknown", trial_end_date: null, first_charge_date: "2026-10-01", notes: "",
    },
    noteHints: ["3 months"],
  },
  {
    id: "intro-discount",
    label: "Discounted first year, then full price",
    text: `Welcome to WordWise Premium!
You paid $29.99 today (October 28, 2026) for your first year (50% off).
Your plan renews on October 28, 2027 at $59.99/year.
wordwise.example`,
    expected: {
      service: "WordWise", plan: "Premium", price: 29.99, currency: "USD",
      billing_period: "yearly", trial_end_date: null, first_charge_date: "2026-10-28", notes: "",
    },
    noteHints: ["59.99"],
  },
  {
    id: "forwarded-plan-change",
    label: "Forwarded email with an old and a new price",
    text: `---------- Forwarded message ---------
From: TaskTrail <no-reply@tasktrail.example>
Date: Sun, Oct 18, 2026
Subject: Your plan has changed

> Previous plan: Solo, $5/month
> New plan: Team, $15/month
> Effective: 2026-10-18 (you were charged $15.00 today)

Sent from my phone`,
    expected: {
      service: "TaskTrail", plan: "Team", price: 15, currency: "USD",
      billing_period: "monthly", trial_end_date: null, first_charge_date: "2026-10-18", notes: "",
    },
    noteHints: ["Solo"],
  },
];
