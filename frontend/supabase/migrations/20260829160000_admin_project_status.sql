-- ============================================================
-- KODALIC WEBSITE
-- Admin Project Status
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_admin_project_status()
RETURNS TABLE (
    status TEXT,
    project_count BIGINT
)
LANGUAGE PLPGSQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN

    -- Only users with projects.view may access project data.
    IF NOT public.has_permission('projects.view') THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    RETURN QUERY
    SELECT
        p.status,
        COUNT(*)::BIGINT AS project_count
    FROM public.projects p
    GROUP BY p.status
    ORDER BY project_count DESC, p.status;

END;
$$;

REVOKE ALL
ON FUNCTION public.get_admin_project_status()
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.get_admin_project_status()
TO authenticated;