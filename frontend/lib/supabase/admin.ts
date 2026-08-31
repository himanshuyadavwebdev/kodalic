import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase admin client that uses the service role key.
 * This client bypasses Row Level Security and should ONLY be used
 * in server-side API routes for public data (e.g. serving media files).
 *
 * NEVER import this in client components or expose the service role key
 * to the browser.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL environment variable.",
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
