import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic";

const VISITORS_KEY = "portfolio:visitors";
const VIEWS_KEY = "portfolio:views";
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|lighthouse|headless/i;

// The Vercel Upstash integration sets KV_REST_API_*; a direct Upstash setup uses UPSTASH_REDIS_REST_*.
function getRedis() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

async function totals(redis: Redis) {
  const [visitors, views] = await redis.mget<[number | null, number | null]>(VISITORS_KEY, VIEWS_KEY);
  return { visitors: visitors ?? 0, views: views ?? 0 };
}

/** Current totals, without counting anything. */
export async function GET() {
  const redis = getRedis();
  if (!redis) return NextResponse.json({ configured: false });
  return NextResponse.json(await totals(redis));
}

/**
 * Records a page view. A browser without a visitor number yet is counted as a
 * new visitor and given the next number; the client keeps it after that.
 */
export async function POST(request: Request) {
  const redis = getRedis();
  if (!redis) return NextResponse.json({ configured: false });

  if (BOT.test(request.headers.get("user-agent") ?? "")) {
    return NextResponse.json(await totals(redis));
  }

  let returning: number | null = null;
  try {
    const body = (await request.json()) as { visitor?: unknown };
    if (typeof body.visitor === "number" && Number.isInteger(body.visitor) && body.visitor > 0) {
      returning = body.visitor;
    }
  } catch {}

  if (returning) {
    const [views, visitors] = await Promise.all([redis.incr(VIEWS_KEY), redis.get<number>(VISITORS_KEY)]);
    return NextResponse.json({ visitor: returning, visitors: visitors ?? returning, views });
  }

  const [visitor, views] = await Promise.all([redis.incr(VISITORS_KEY), redis.incr(VIEWS_KEY)]);
  return NextResponse.json({ visitor, visitors: visitor, views });
}
