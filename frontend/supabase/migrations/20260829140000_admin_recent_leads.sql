-- ============================================================
-- KODALIC WEBSITE
-- Admin Recent Leads
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_admin_recent_leads(
    p_limit INTEGER DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    contact_fields JSONB,
    service TEXT,
    budget TEXT,
    status TEXT,
    source TEXT,
    created_at TIMESTAMPTZ
)
LANGUAGE PLPGSQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN

    -- Only users with leads.view may read lead information.
    IF NOT public.has_permission('leads.view') THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    RETURN QUERY
    SELECT
        l.id,
        l.contact_fields,
        l.service,
        l.budget,
        l.status,
        l.source,
        l.created_at
    FROM public.leads l
    ORDER BY l.created_at DESC
    LIMIT LEAST(GREATEST(p_limit, 1), 20);

END;
$$;

REVOKE ALL
ON FUNCTION public.get_admin_recent_leads(INTEGER)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.get_admin_recent_leads(INTEGER)
TO authenticated;