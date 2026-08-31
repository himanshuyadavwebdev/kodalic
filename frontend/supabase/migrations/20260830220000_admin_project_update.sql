-- ============================================================
-- KODALIC WEBSITE
-- Migration: Admin Project Update
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_admin_project(
    p_project_id UUID,
    p_title TEXT,
    p_slug TEXT,
    p_description TEXT,
    p_category_id UUID,
    p_featured BOOLEAN,
    p_status TEXT,
    p_live_url TEXT,
    p_solution_type TEXT,
    p_project_order INTEGER
)
RETURNS VOID
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_title TEXT;
    v_slug TEXT;
    v_description TEXT;
BEGIN

    IF NOT public.has_permission('projects.update') THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    v_title := trim(p_title);
    v_slug := trim(p_slug);
    v_description := trim(p_description);

    IF v_title = '' THEN
        RAISE EXCEPTION 'Project title is required';
    END IF;

    IF v_slug = '' THEN
        RAISE EXCEPTION 'Project slug is required';
    END IF;

    IF v_description = '' THEN
        RAISE EXCEPTION 'Project description is required';
    END IF;

    IF p_status NOT IN (
        'draft',
        'published',
        'archived'
    ) THEN
        RAISE EXCEPTION 'Invalid project status';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM public.projects
        WHERE id = p_project_id
    ) THEN
        RAISE EXCEPTION 'Project not found';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.projects
        WHERE slug = v_slug
          AND id <> p_project_id
    ) THEN
        RAISE EXCEPTION 'A project with this slug already exists';
    END IF;

    UPDATE public.projects
    SET
        title = v_title,
        slug = v_slug,
        description = v_description,
        category_id = p_category_id,
        featured = COALESCE(p_featured, false),
        status = p_status,
        live_url = NULLIF(trim(p_live_url), ''),
        published_at = CASE
            WHEN p_status = 'published'
                THEN COALESCE(published_at, NOW())
            ELSE NULL
        END,
        solution_type = NULLIF(trim(p_solution_type), ''),
        "order" = COALESCE(p_project_order, 999),
        updated_at = NOW()
    WHERE id = p_project_id;

END;
$$;


REVOKE ALL
ON FUNCTION public.update_admin_project(
    UUID,
    TEXT,
    TEXT,
    TEXT,
    UUID,
    BOOLEAN,
    TEXT,
    TEXT,
    TEXT,
    INTEGER
)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.update_admin_project(
    UUID,
    TEXT,
    TEXT,
    TEXT,
    UUID,
    BOOLEAN,
    TEXT,
    TEXT,
    TEXT,
    INTEGER
)
TO authenticated;