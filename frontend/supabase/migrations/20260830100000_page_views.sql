-- ============================================================
-- KODALIC WEBSITE
-- Migration: Page Views Analytics
-- ============================================================


-- ============================================================
-- PAGE VIEWS
-- ============================================================

CREATE TABLE public.page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    path TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_page_views_path
    ON public.page_views(path);

CREATE INDEX idx_page_views_created_at
    ON public.page_views(created_at);

CREATE INDEX idx_page_views_path_created_at
    ON public.page_views(path, created_at);


-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- PUBLIC PAGE VIEW CREATION
-- ============================================================

CREATE POLICY "Public can create page views"

ON public.page_views

FOR INSERT

TO anon, authenticated

WITH CHECK (
    length(path) > 0
    AND length(path) <= 500
);


-- ============================================================
-- ADMIN READ POLICY
-- ============================================================

CREATE POLICY "Authorized users can read page views"

ON public.page_views

FOR SELECT

TO authenticated

USING (
    public.has_permission('analytics.view')
);


-- ============================================================
-- ADMIN TOP PAGES FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_admin_top_pages(
    p_days INTEGER DEFAULT 30,
    p_limit INTEGER DEFAULT 5
)
RETURNS TABLE (
    path TEXT,
    view_count BIGINT
)
LANGUAGE PLPGSQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
    v_days INTEGER;
    v_limit INTEGER;
BEGIN

    IF NOT public.has_permission('analytics.view') THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    v_days := LEAST(GREATEST(p_days, 1), 365);
    v_limit := LEAST(GREATEST(p_limit, 1), 20);

    RETURN QUERY
    SELECT
        pv.path,
        COUNT(*)::BIGINT AS view_count
    FROM public.page_views pv
    WHERE pv.created_at >= NOW() - make_interval(days => v_days)
    GROUP BY pv.path
    ORDER BY view_count DESC, pv.path
    LIMIT v_limit;

END;
$$;


-- ============================================================
-- FUNCTION SECURITY
-- ============================================================

REVOKE ALL
ON FUNCTION public.get_admin_top_pages(INTEGER, INTEGER)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.get_admin_top_pages(INTEGER, INTEGER)
TO authenticated;