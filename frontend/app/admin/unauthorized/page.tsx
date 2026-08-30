export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-[#080c1e] px-6 py-16 text-white flex items-center justify-center">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 text-5xl">
          🔒
        </div>

        <h1 className="text-3xl font-semibold">
          Access Denied
        </h1>

        <p className="mt-3 text-white/60">
          You are signed in, but you don't have permission to access
          the Kodalic administration panel.
        </p>

        <a
          href="/"
          className="mt-8 inline-block rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
        >
          Back to website
        </a>
      </div>
    </main>
  );
}