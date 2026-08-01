/**
 * IndexNow / an open protocol (backed by Bing, Yandex, Seznam, and others)
 * that lets a site push "this URL changed" pings for near-instant crawling,
 * instead of waiting for a crawler to rediscover it on its own. No account
 * required: the key just has to be hosted at /<key>.txt to prove domain
 * ownership. Google doesn't consume IndexNow directly, but Bing does, and
 * Bing-syndicated results also power DuckDuckGo, Yahoo, and Copilot search -
 * a real, free, zero-setup way to get found faster on non-Google surfaces.
 */
export const INDEXNOW_KEY = "b5c9883c34af1ac2aeaef40d066029c5";

export async function submitUrlsToIndexNow(
  host: string,
  urls: string[],
): Promise<{ ok: boolean; status?: number }> {
  if (urls.length === 0) return { ok: true };
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false };
  }
}
