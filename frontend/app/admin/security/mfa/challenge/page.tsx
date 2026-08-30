"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../../lib/supabase/client";

export default function MfaChallengePage() {
  const router = useRouter();
  const supabase = createClient();

  const [code, setCode] = useState("");
  const [factorId, setFactorId] = useState("");
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFactor() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const { data, error } = await supabase.auth.mfa.listFactors();

      if (error) {
        setError("Unable to load your authentication factor.");
        setLoading(false);
        return;
      }

      const verifiedTotp = data.totp.find(
        (factor) => factor.status === "verified"
      );

      if (!verifiedTotp) {
        router.replace("/admin/security/mfa");
        return;
      }

      setFactorId(verifiedTotp.id);
      setLoading(false);
    }

    loadFactor();
  }, [router, supabase]);

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit authenticator code.");
      return;
    }

    if (!factorId) {
      setError("Authentication factor is unavailable.");
      return;
    }

    setVerifying(true);

    const { data: challengeData, error: challengeError } =
      await supabase.auth.mfa.challenge({
        factorId,
      });

    if (challengeError) {
      setError("Unable to start MFA verification.");
      setVerifying(false);
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code,
    });

    if (verifyError) {
      setError("Invalid verification code.");
      setCode("");
      setVerifying(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#080c1e] text-white flex items-center justify-center px-6">
        <p className="text-sm text-white/60">
          Preparing verification...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080c1e] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Two-Factor Authentication
          </h1>

          <p className="mt-2 text-sm text-white/55">
            Enter the 6-digit code from your authenticator app.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl">
          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label
                htmlFor="code"
                className="mb-2 block text-sm font-medium text-white/80"
              >
                Authentication code
              </label>

              <input
                id="code"
                name="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, ""))
                }
                disabled={verifying}
                required
                autoFocus
                placeholder="000000"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-center text-2xl tracking-[0.5em] text-white outline-none transition focus:border-white/30 disabled:opacity-60"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={verifying || code.length !== 6}
              className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {verifying ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}