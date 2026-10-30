// Where pages get subscription data. Today it returns mock data; later this
// is the one place to swap in a real database.
//
// The mock dates depend on the current date, so with Cache Components we
// call `await io()` first. That keeps these values out of the build-time
// static shell and computes them fresh for each request.

import { io } from "next/cache";
import { toISODate } from "./dates";
import { buildMockSubscriptions } from "./mock-data";
import type { Subscription } from "./types";

export async function getToday(): Promise<string> {
  await io();
  return toISODate(new Date());
}

export async function getSubscriptions(): Promise<Subscription[]> {
  return buildMockSubscriptions(await getToday());
}

export async function getSubscription(
  id: string,
): Promise<Subscription | undefined> {
  const subs = await getSubscriptions();
  return subs.find((sub) => sub.id === id);
}
