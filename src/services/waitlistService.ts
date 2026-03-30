export interface WaitlistPayload {
  firstName: string;
  lastName: string;
  email: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export async function submitLead(payload: WaitlistPayload): Promise<void> {
  const response = await fetch("/.netlify/functions/submit-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      (data as { error?: string }).error ?? "Submission failed. Please try again."
    );
  }
}
