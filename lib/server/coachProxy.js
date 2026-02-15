function normalizeBaseUrl(raw) {
  return String(raw || "").trim().replace(/\/$/, "");
}

export function getCoachBaseUrl() {
  const base = normalizeBaseUrl(process.env.COACH_BASE_URL);
  if (!base) {
    throw new Error("Missing COACH_BASE_URL");
  }
  return base;
}

export async function fetchCoachJson(pathname) {
  const base = getCoachBaseUrl();
  const path = String(pathname || "").startsWith("/")
    ? String(pathname || "")
    : `/${String(pathname || "")}`;
  const url = `${base}${path}`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      accept: "application/json",
    },
  });

  const text = await res.text().catch(() => "");
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    const err = new Error(`Coach responded ${res.status}`);
    err.status = res.status;
    err.preview = String(text || "").slice(0, 200);
    throw err;
  }

  if (!data || typeof data !== "object") {
    const err = new Error("Invalid JSON from Coach");
    err.status = 502;
    throw err;
  }

  return data;
}
