-- ============================================================
-- KODALIC WEBSITE
-- Admin Lead Overview
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_admin_lead_overview(
    p_days INTEGER DEFAULT 7
)
RETURNS TABLE (
    day DATE,
    lead_count BIGINT
)
LANGUAGE PLPGSQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
    v_days INTEGER;
BEGIN

    -- Only users with leads.view may access lead analytics.
    IF NOT public.has_permission('leads.view') THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    -- Keep the requested range reasonable.
    v_days := LEAST(GREATEST(p_days, 1), 30);

    RETURN QUERY
    SELECT
        d::DATE AS day,
        COUNT(l.id)::BIGINT AS lead_count
    FROM generate_series(
        CURRENT_DATE - (v_days - 1),
        CURRENT_DATE,
        INTERVAL '1 day'
    ) AS d
    LEFT JOIN public.leads l
        ON l.created_at >= d
        AND l.created_at < d + INTERVAL '1 day'
    GROUP BY d
    ORDER BY d;

END;
$$;

REVOKE ALL
ON FUNCTION public.get_admin_lead_overview(INTEGER)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.get_admin_lead_overview(INTEGER)
TO authenticated;