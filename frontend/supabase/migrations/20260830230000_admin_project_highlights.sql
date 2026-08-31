-- ============================================================
-- KODALIC WEBSITE
-- Migration: Admin Project Highlights
-- ============================================================


-- ============================================================
-- GET PROJECT HIGHLIGHTS
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_admin_project_highlights(
    p_project_id UUID
)
RETURNS TABLE (
    id UUID,
    project_id UUID,
    text TEXT,
    highlight_order INTEGER,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
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
        h.id,
        h.project_id,
        h.text,
        h."order",
        h.created_at,
        h.updated_at
    FROM public.project_highlights h
    WHERE h.project_id = p_project_id
    ORDER BY h."order" ASC, h.created_at ASC;

END;
$$;


REVOKE ALL
ON FUNCTION public.get_admin_project_highlights(UUID)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.get_admin_project_highlights(UUID)
TO authenticated;


-- ============================================================
-- ADD PROJECT HIGHLIGHT
-- ============================================================

CREATE OR REPLACE FUNCTION public.add_admin_project_highlight(
    p_project_id UUID,
    p_text TEXT,
    p_order INTEGER
)
RETURNS UUID
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_highlight_id UUID;
    v_text TEXT;
BEGIN

    IF NOT public.has_permission('projects.update') THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    v_text := trim(p_text);

    IF v_text = '' THEN
        RAISE EXCEPTION 'Highlight text is required';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM public.projects
        WHERE id = p_project_id
    ) THEN
        RAISE EXCEPTION 'Project not found';
    END IF;

    INSERT INTO public.project_highlights (
        project_id,
        text,
        "order"
    )
    VALUES (
        p_project_id,
        v_text,
        COALESCE(p_order, 999)
    )
    RETURNING id INTO v_highlight_id;

    RETURN v_highlight_id;

END;
$$;


REVOKE ALL
ON FUNCTION public.add_admin_project_highlight(UUID, TEXT, INTEGER)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.add_admin_project_highlight(UUID, TEXT, INTEGER)
TO authenticated;


-- ============================================================
-- DELETE PROJECT HIGHLIGHT
-- ============================================================

CREATE OR REPLACE FUNCTION public.delete_admin_project_highlight(
    p_highlight_id UUID
)
RETURNS VOID
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN

    IF NOT public.has_permission('projects.update') THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    DELETE FROM public.project_highlights
    WHERE id = p_highlight_id;

END;
$$;


REVOKE ALL
ON FUNCTION public.delete_admin_project_highlight(UUID)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.delete_admin_project_highlight(UUID)
TO authenticated;