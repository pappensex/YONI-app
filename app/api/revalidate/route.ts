import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * On-demand revalidation endpoint for CMS/Stripe events
 *
 * Usage:
 * POST /api/revalidate?secret=YOUR_SECRET
 * Body: { path: '/some-path' } or { tag: 'some-tag' }
 *
 * Requires REVALIDATE_SECRET environment variable
 */
export async function POST(request: NextRequest) {
  try {
    // Verify secret token for security
    const secret = request.nextUrl.searchParams.get("secret");

    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    const body = await request.json();

    // Revalidate by path
    if (body.path) {
      revalidatePath(body.path);
      return NextResponse.json({
        revalidated: true,
        type: "path",
        target: body.path,
        now: Date.now(),
      });
    }

    // Revalidate by tag
    if (body.tag) {
      revalidateTag(body.tag);
      return NextResponse.json({
        revalidated: true,
        type: "tag",
        target: body.tag,
        now: Date.now(),
      });
    }

    return NextResponse.json(
      { error: "Missing path or tag parameter" },
      { status: 400 },
    );
  } catch (error: any) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      {
        error: "Failed to revalidate",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
