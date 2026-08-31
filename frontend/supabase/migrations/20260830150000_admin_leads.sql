-- ============================================================
-- KODALIC WEBSITE
-- Migration: Admin Leads Lookup
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_admin_leads()
RETURNS TABLE (
    id UUID,
    contact_fields JSONB,
    service TEXT,
    budget TEXT,
    message TEXT,
    source TEXT,
    landing_page TEXT,
    utm JSONB,
    status TEXT,
    assigned_user_id UUID,
    crm_external_id TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE PLPGSQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN

    IF NOT public.has_permission('leads.view') THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    RETURN QUERY
    SELECT
        l.id,
        l.contact_fields,
        l.service,
        l.budget,
        l.message,
        l.source,
        l.landing_page,
        l.utm,
        l.status,
        l.assigned_user_id,
        l.crm_external_id,
        l.created_at,
        l.updated_at
    FROM public.leads l
    ORDER BY l.created_at DESC;

END;
$$;


REVOKE ALL
ON FUNCTION public.get_admin_leads()
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.get_admin_leads()
TO authenticated;