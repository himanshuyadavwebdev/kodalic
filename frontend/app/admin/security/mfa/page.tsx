"use client";

import { useState } from "react";
import { createClient } from "../../../../lib/supabase/client";

type TotpEnrollment = {
  id: string;
  qr_code: string;
  secret: string;
  uri: string;
};

export default function MfaPage() {
  const supabase = createClient();

  const [enrollment, setEnrollment] = useState<TotpEnrollment | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function startEnrollment() {
    setLoading(true);
    setError("");
    setMessage("");

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "Kodalic Authenticator",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setEnrollment({
      id: data.id,
      qr_code: data.totp.qr_code,
      secret: data.totp.secret,
      uri: data.totp.uri,
    });

    setLoading(false);
  }

  async function verifyEnrollment() {
    if (!enrollment) {
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit authenticator code.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    const { data: challengeData, error: challengeError } =
      await supabase.auth.mfa.challenge({
        factorId: enrollment.id,
      });

    if (challengeError) {
      setError(challengeError.message);
      setLoading(false);
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: enrollment.id,
      challengeId: challengeData.id,
      code,
    });

    if (verifyError) {
      setError(verifyError.message);
      setLoading(false);
      return;
    }

    setMessage(
      "Authenticator successfully enabled. Your session is now MFA verified."
    );

    setCode("");
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#080c1e] px-6 py-16 text-white">
      <div className="mx-auto max-w-xl">
        <p className="text-sm text-white/50">
          Account Security
        </p>

        <h1 className="mt-2 text-4xl font-semibold">
          Two-Factor Authentication
        </h1>

        <p className="mt-4 text-white/60">
          Secure your Kodalic account with an authenticator app.
        </p>

        {!enrollment && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-semibold">
              Enable authenticator
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/60">
              Use Google Authenticator, Microsoft Authenticator, Authy,
              1Password, or another TOTP-compatible authenticator app.
            </p>

            <button
              type="button"
              onClick={startEnrollment}
              disabled={loading}
              className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Generating..." : "Set up authenticator"}
            </button>
          </div>
        )}

        {enrollment && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-xl font-semibold">
                1. Scan the QR code
              </h2>

              <p className="mt-3 text-sm text-white/60">
                Open your authenticator app and scan this QR code.
              </p>

              <div
                className="mx-auto mt-6 w-fit rounded-2xl bg-white p-4"
                dangerouslySetInnerHTML={{
                  __html: enrollment.qr_code,
                }}
              />
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-xl font-semibold">
                2. Enter the verification code
              </h2>

              <p className="mt-3 text-sm text-white/60">
                Enter the current 6-digit code shown in your authenticator
                app.
              </p>

              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, ""))
                }
                placeholder="000000"
                className="mt-6 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-center text-2xl tracking-[0.5em] text-white outline-none placeholder:text-white/20 focus:border-white/30"
              />

              <button
                type="button"
                onClick={verifyEnrollment}
                disabled={loading || code.length !== 6}
                className="mt-5 w-full rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify and enable 2FA"}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-6 rounded-xl border border-green-400/20 bg-green-400/10 p-4 text-sm text-green-200">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}