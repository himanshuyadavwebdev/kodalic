-- ============================================================
-- KODALIC WEBSITE
-- Migration: Admin Case Studies Read
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_admin_case_studies()
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    domain TEXT,
    description TEXT,
    story TEXT,
    website_url TEXT,
    hero_media_id UUID,
    client_name TEXT,
    completed_at DATE,
    published BOOLEAN,
    featured BOOLEAN,
    "order" INTEGER,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE PLPGSQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN

    IF NOT public.has_permission('case_studies.view') THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    RETURN QUERY
    SELECT
        cs.id,
        cs.title,
        cs.slug,
        cs.domain,
        cs.description,
        cs.story,
        cs.website_url,
        cs.hero_media_id,
        cs.client_name,
        cs.completed_at,
        cs.published,
        cs.featured,
        cs."order",
        cs.seo_title,
        cs.seo_description,
        cs.created_at,
        cs.updated_at
    FROM public.case_studies cs
    ORDER BY
        cs."order" ASC,
        cs.created_at DESC;

END;
$$;


REVOKE ALL
ON FUNCTION public.get_admin_case_studies()
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.get_admin_case_studies()
TO authenticated;