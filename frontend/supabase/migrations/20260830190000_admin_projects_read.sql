-- ============================================================
-- KODALIC WEBSITE
-- Migration: Admin Projects Read
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_admin_projects()
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    description TEXT,
    category_id UUID,
    featured BOOLEAN,
    status TEXT,
    live_url TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    solution_type TEXT,
    project_order INTEGER
)
LANGUAGE PLPGSQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN

    IF NOT public.has_permission('projects.view') THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    RETURN QUERY
    SELECT
        p.id,
        p.title,
        p.slug,
        p.description,
        p.category_id,
        p.featured,
        p.status,
        p.live_url,
        p.published_at,
        p.created_at,
        p.updated_at,
        p.solution_type,
        p."order"
    FROM public.projects p
    ORDER BY p."order" ASC, p.created_at DESC;

END;
$$;


REVOKE ALL
ON FUNCTION public.get_admin_projects()
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.get_admin_projects()
TO authenticated;   