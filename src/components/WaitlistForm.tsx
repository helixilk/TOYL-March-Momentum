import React, { useState } from "react";
import { submitLead } from "../services/waitlistService";

type FormState = "idle" | "loading" | "success" | "error";

export function WaitlistForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const utmParams = React.useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get("utm_source") ?? undefined,
      utmMedium: params.get("utm_medium") ?? undefined,
      utmCampaign: params.get("utm_campaign") ?? undefined,
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("loading");
    try {
      await submitLead({ firstName, lastName, email, ...utmParams });
      (window.dataLayer = window.dataLayer || []).push({ event: 'generate_lead', form_name: 'waitlist' });
      setFormState("success");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Submission failed. Please try again.");
      setFormState("error");
    }
  }

  if (formState === "success") {
    return (
      <div className="rounded-2xl bg-viridian/10 border border-viridian/20 p-8 text-center">
        <h2 className="text-2xl font-bold text-viridian mb-3">You're on the list!</h2>
        <p className="text-gray-700">
          Thank you for joining. We'll be in touch with everything you need to get started.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          id="firstName"
          type="text"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-viridian focus:border-transparent"
          placeholder="Jane"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
          Last Name
        </label>
        <input
          id="lastName"
          type="text"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-viridian focus:border-transparent"
          placeholder="Doe"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-viridian focus:border-transparent"
          placeholder="jane@example.com"
        />
      </div>

      {formState === "error" && (
        <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={formState === "loading"}
        aria-busy={formState === "loading" ? "true" : undefined}
        className="mt-2 rounded-full bg-viridian px-8 py-4 font-semibold text-white shadow-lg shadow-viridian/20 transition-all duration-300 hover:bg-viridian-dark active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {formState === "loading" ? "Joining..." : "Join the Waitlist"}
      </button>
    </form>
  );
}

export default WaitlistForm;
