import { NextResponse } from "next/server";

/**
 * Contact form endpoint — placeholder implementation.
 *
 * TODO: wire this to a real destination:
 *  - transactional email (e.g. Resend / Postmark / SES), or
 *  - a CRM webhook (HubSpot, Pipedrive, Notion, Slack…)
 * Keep the honeypot short-circuit below — it silently swallows bot
 * submissions without telling the bot anything went wrong.
 */
export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  // Honeypot tripped → pretend success, do nothing.
  if (typeof data.website === "string" && data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  // Minimal server-side sanity check (full validation happens client-side
  // with Zod; re-validate here too once this endpoint does real work).
  if (!data.name || !data.email || !data.message) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields." },
      { status: 422 },
    );
  }

  console.log("[contact] New inquiry (not yet delivered anywhere):", {
    name: data.name,
    email: data.email,
    company: data.company ?? null,
    service: data.service ?? null,
    budget: data.budget || null,
    message: data.message,
  });

  return NextResponse.json({ ok: true });
}
