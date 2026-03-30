import type { Context } from "@netlify/functions";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
};

export default async (req: Request, _context: Context): Promise<Response> => {
  // Method guard
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  // Parse body
  let body: {
    firstName?: string;
    lastName?: string;
    email?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };

  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const { firstName, lastName, email, utmSource, utmMedium, utmCampaign } =
    body;

  // Server-side validation — lastName and email are required
  if (!lastName || lastName.trim() === "" || !email || email.trim() === "") {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  // Read env vars
  const apiKey = process.env.ESPOCRM_API_KEY;
  const baseUrl = process.env.ESPOCRM_BASE_URL;

  if (!apiKey || !baseUrl) {
    return new Response(JSON.stringify({ error: "Server misconfiguration" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  // Build UTM description
  const description = utmSource
    ? `utm_source=${utmSource} utm_medium=${utmMedium} utm_campaign=${utmCampaign}`
    : undefined;

  // EspoCRM POST with timeout
  let crmResponse: globalThis.Response;
  try {
    crmResponse = await fetch(`${baseUrl}/api/v1/Lead`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify({
        firstName,
        lastName,
        emailAddress: email,
        source: "Web Site",
        description,
      }),
      signal: AbortSignal.timeout(8000),
    });
  } catch (err) {
    const isAbort =
      err instanceof Error &&
      (err.name === "AbortError" || err.name === "TimeoutError");
    if (isAbort) {
      return new Response(
        JSON.stringify({ error: "CRM request timed out" }),
        {
          status: 504,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    return new Response(JSON.stringify({ error: "CRM error" }), {
      status: 502,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  // Upstream error
  if (!crmResponse.ok) {
    return new Response(JSON.stringify({ error: "CRM error" }), {
      status: 502,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  // Success
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
};
