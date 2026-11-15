import { NextResponse } from "next/server";
import { OffersResponse } from "@/types/offer";
import rawOffers from "@/data/offers.json";

const offers: OffersResponse["offers"] = rawOffers as OffersResponse["offers"];

export const runtime = "nodejs";

const SIMULATE_STATES = ["ok", "slow", "empty", "partial", "error"] as const;
type SimulateState = (typeof SIMULATE_STATES)[number];

const MIN_DELAY_MS = 1200;
const MAX_DELAY_MS = 2500;
const FIXED_DELAY_MS = 1500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay(): number {
  return MIN_DELAY_MS + Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1));
}

function resolveDelay(state: SimulateState | undefined): number {
  switch (state) {
    case "ok":
      return MIN_DELAY_MS;
    case "slow":
      return MAX_DELAY_MS;
    case "empty":
    case "partial":
      return FIXED_DELAY_MS;
    case "error":
    case undefined:
      return randomDelay();
    default:
      return randomDelay();
  }
}

function partialOffers(): OffersResponse {
  const subset = offers.slice(0, 6);
  return {
    offers: subset,
    count: subset.length,
    failedAirlines: ["Pakistan International Airlines", "Emirates"],
  };
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const simulate = (searchParams.get("simulate") || undefined) as SimulateState | undefined;

  if (simulate !== undefined && !SIMULATE_STATES.includes(simulate)) {
    return NextResponse.json(
      { error: `invalid simulate value. Use one of: ${SIMULATE_STATES.join(", ")}` },
      { status: 400 }
    );
  }

  const delayMs = resolveDelay(simulate);
  if (simulate === "error") {
    return NextResponse.json({ error: "service_unavailable" }, { status: 503 });
  }
  await sleep(delayMs);

  if (simulate === "empty") {
    return NextResponse.json({ offers: [], count: 0, failedAirlines: [] });
  }

  if (simulate === "partial") {
    return NextResponse.json(partialOffers());
  }

  return NextResponse.json({ offers, count: offers.length, failedAirlines: [] });
}
