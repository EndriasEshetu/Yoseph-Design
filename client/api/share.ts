import { PRODUCTS } from "../src/data/products";

type ShareRequest = {
  headers: Record<string, string | string[] | undefined>;
  query: { product?: string | string[] };
};

type ShareResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => ShareResponse;
  send: (body: string) => void;
};

function getOrigin(req: ShareRequest) {
  const forwardedProto = Array.isArray(req.headers["x-forwarded-proto"])
    ? req.headers["x-forwarded-proto"][0]
    : req.headers["x-forwarded-proto"];
  const protocol = forwardedProto || "https";

  const forwardedHost = Array.isArray(req.headers["x-forwarded-host"])
    ? req.headers["x-forwarded-host"][0]
    : req.headers["x-forwarded-host"];

  const host = forwardedHost || req.headers.host || "yosephdesign.vercel.app";
  return `${protocol}://${host}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type ShareProduct = {
  id: string;
  name: string;
  description: string;
  image: string;
};

async function getProductFromApi(productId: string): Promise<ShareProduct | null> {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  const apiBase = (env?.VITE_API_URL || env?.API_URL || "").trim().replace(/\/$/, "");
  if (!apiBase || !productId) return null;

  try {
    const response = await fetch(`${apiBase}/api/products`);
    if (!response.ok) return null;

    const data = (await response.json()) as Array<Record<string, unknown>>;
    const match = data.find((item) => String(item.id) === productId);
    if (!match) return null;

    const id = String(match.id || "");
    const name = String(match.name || "");
    const description = String(match.description || "");
    const image = String(match.image || "");

    if (!id || !name || !image) return null;
    return { id, name, description, image };
  } catch {
    return null;
  }
}

export default async function handler(req: ShareRequest, res: ShareResponse) {
  const productId = typeof req.query.product === "string" ? req.query.product : "";
  const fallbackProduct = PRODUCTS.find((item) => item.id === productId) ?? PRODUCTS[0];
  const product = (await getProductFromApi(productId)) ?? fallbackProduct;
  const origin = getOrigin(req);
  const appUrl = `${origin}/?product=${encodeURIComponent(product.id)}`;
  const shareUrl = `${origin}/api/share?product=${encodeURIComponent(product.id)}`;
  const title = `${product.name} | Yoseph Design`;
  const description = product.description;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");

  res.status(200).send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta property="og:type" content="product" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(product.image)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(product.image)}" />
    <meta property="og:url" content="${escapeHtml(shareUrl)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(product.image)}" />
    <title>${escapeHtml(title)}</title>
    <meta http-equiv="refresh" content="2;url=${escapeHtml(appUrl)}" />
    <style>
      body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #fff; color: #111; }
      .wrap { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
      .card { max-width: 560px; width: 100%; border: 1px solid #e5e5e5; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,.08); }
      img { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; }
      .content { padding: 20px; }
      .eyebrow { text-transform: uppercase; letter-spacing: .24em; font-size: 11px; color: #888; margin-bottom: 8px; }
      h1 { font-size: 28px; line-height: 1.1; margin: 0 0 10px; }
      p { margin: 0 0 16px; color: #555; line-height: 1.5; }
      a { display: inline-block; background: #d97706; color: #fff; text-decoration: none; padding: 12px 16px; border-radius: 999px; font-weight: 600; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="card">
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" />
        <div class="content">
          <div class="eyebrow">Yoseph Design</div>
          <h1>${escapeHtml(product.name)}</h1>
          <p>${escapeHtml(description)}</p>
          <a href="${escapeHtml(appUrl)}">View product</a>
        </div>
      </div>
    </div>
  </body>
</html>`);
}