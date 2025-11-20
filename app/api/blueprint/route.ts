import { NextResponse } from "next/server";

import { blueprint } from "@/app/data/chibot-blueprint";

export const dynamic = "force-dynamic";

export async function GET() {
  const generatedAt = new Date().toISOString();

  return NextResponse.json({
    blueprint,
    meta: {
      generatedAt,
      kernel: blueprint.kernel,
    },
  });
}
