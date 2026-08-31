"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const supabase = createClient();

    void supabase.from("page_views").insert({
      path: pathname,
    });
  }, [pathname]);

  return null;
}