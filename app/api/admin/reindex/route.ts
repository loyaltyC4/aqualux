import { NextRequest, NextResponse } from "next/server";
import { checkAdminPassword, isAdminConfigured } from "lib/admin-auth";
import { getAllSiteUrls } from "lib/site-urls";
import { submitUrlsToIndexNow } from "lib/indexnow";
import { baseUrl } from "lib/utils";

export const dynamic = "force-dynamic";

/**
 * Manually (or post-deploy) triggerable: pushes every real site URL to
 * IndexNow so Bing/Yandex (and Bing-syndicated surfaces) can crawl fast
 * instead of waiting to rediscover the site on their own schedule.
 */
export async function POST(req: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "admin_unconfigured", message: "Set ADMIN_ACCESS_KEY first." },
      { status: 503 },
    );
  }

  const auth = req.headers.get("authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (!checkAdminPassword(token)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const urls = await getAllSiteUrls();
  const host = new URL(baseUrl).host;
  const result = await submitUrlsToIndexNow(host, urls);

  return NextResponse.json({
    submitted: urls.length,
    indexNowOk: result.ok,
    indexNowStatus: result.status,
  });
}
