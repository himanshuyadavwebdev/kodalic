-- ============================================================
-- KODALIC WEBSITE
-- Migration: Admin Projects Create
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_admin_project(
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
RETURNS UUID
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_project_id UUID;
    v_title TEXT;
    v_slug TEXT;
    v_description TEXT;
BEGIN

    IF NOT public.has_permission('projects.create') THEN
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

    IF EXISTS (
        SELECT 1
        FROM public.projects
        WHERE slug = v_slug
    ) THEN
        RAISE EXCEPTION 'A project with this slug already exists';
    END IF;

    INSERT INTO public.projects (
        title,
        slug,
        description,
        category_id,
        featured,
        status,
        live_url,
        published_at,
        solution_type,
        "order"
    )
    VALUES (
        v_title,
        v_slug,
        v_description,
        p_category_id,
        COALESCE(p_featured, false),
        p_status,
        NULLIF(trim(p_live_url), ''),
        CASE
            WHEN p_status = 'published'
                THEN NOW()
            ELSE NULL
        END,
        NULLIF(trim(p_solution_type), ''),
        COALESCE(p_project_order, 999)
    )
    RETURNING id INTO v_project_id;

    RETURN v_project_id;

END;
$$;


REVOKE ALL
ON FUNCTION public.create_admin_project(
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
ON FUNCTION public.create_admin_project(
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