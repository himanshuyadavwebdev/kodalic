-- ============================================================
-- KODALIC WEBSITE
-- Admin Dashboard Metrics
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_admin_dashboard_metrics()
RETURNS JSONB
LANGUAGE PLPGSQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN

    -- Only users with admin.access may read dashboard metrics.
    IF NOT public.has_permission('admin.access') THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    RETURN jsonb_build_object(
        'leads_total',
        (
            SELECT COUNT(*)
            FROM public.leads
        ),

        'leads_new',
        (
            SELECT COUNT(*)
            FROM public.leads
            WHERE status = 'new'
        ),

        'projects_total',
        (
            SELECT COUNT(*)
            FROM public.projects
        ),

        'projects_published',
        (
            SELECT COUNT(*)
            FROM public.projects
            WHERE status = 'published'
        )
    );

END;
$$;

-- ============================================================
-- Protect the function
-- ============================================================

REVOKE ALL
ON FUNCTION public.get_admin_dashboard_metrics()
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.get_admin_dashboard_metrics()
TO authenticated;