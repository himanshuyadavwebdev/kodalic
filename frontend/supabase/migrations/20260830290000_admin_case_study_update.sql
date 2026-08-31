-- ============================================================
-- KODALIC WEBSITE
-- Migration: Admin Case Study Update
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_admin_case_study(
    p_case_study_id UUID,
    p_title TEXT,
    p_slug TEXT,
    p_domain TEXT,
    p_description TEXT,
    p_story TEXT,
    p_website_url TEXT,
    p_hero_media_id UUID,
    p_client_name TEXT,
    p_completed_at DATE,
    p_published BOOLEAN,
    p_featured BOOLEAN,
    p_order INTEGER,
    p_seo_title TEXT,
    p_seo_description TEXT
)
RETURNS BOOLEAN
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_published_count INTEGER;
    v_current_published BOOLEAN;
BEGIN

    IF NOT public.has_permission('case_studies.update') THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    IF p_case_study_id IS NULL THEN
        RAISE EXCEPTION 'Case study ID is required';
    END IF;

    IF trim(COALESCE(p_title, '')) = '' THEN
        RAISE EXCEPTION 'Case study title is required';
    END IF;

    IF trim(COALESCE(p_slug, '')) = '' THEN
        RAISE EXCEPTION 'Case study slug is required';
    END IF;

    IF trim(COALESCE(p_domain, '')) = '' THEN
        RAISE EXCEPTION 'Case study domain is required';
    END IF;

    IF trim(COALESCE(p_description, '')) = '' THEN
        RAISE EXCEPTION 'Case study description is required';
    END IF;

    IF trim(COALESCE(p_story, '')) = '' THEN
        RAISE EXCEPTION 'Case study story is required';
    END IF;

    SELECT published
    INTO v_current_published
    FROM public.case_studies
    WHERE id = p_case_study_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Case study not found';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.case_studies
        WHERE slug = trim(p_slug)
          AND id <> p_case_study_id
    ) THEN
        RAISE EXCEPTION
            'A case study with this slug already exists';
    END IF;

    IF COALESCE(p_published, false)
       AND NOT COALESCE(v_current_published, false)
    THEN

        SELECT COUNT(*)
        INTO v_published_count
        FROM public.case_studies
        WHERE published = true
          AND id <> p_case_study_id;

        IF v_published_count >= 5 THEN
            RAISE EXCEPTION
                'Maximum of 5 published case studies allowed';
        END IF;

    END IF;

    UPDATE public.case_studies
    SET
        title = trim(p_title),
        slug = trim(p_slug),
        domain = trim(p_domain),
        description = trim(p_description),
        story = trim(p_story),
        website_url =
            NULLIF(trim(COALESCE(p_website_url, '')), ''),
        hero_media_id = p_hero_media_id,
        client_name =
            NULLIF(trim(COALESCE(p_client_name, '')), ''),
        completed_at = p_completed_at,
        published = COALESCE(p_published, false),
        featured = COALESCE(p_featured, false),
        "order" = COALESCE(p_order, 999),
        seo_title =
            NULLIF(trim(COALESCE(p_seo_title, '')), ''),
        seo_description =
            NULLIF(
                trim(COALESCE(p_seo_description, '')),
                ''
            ),
        updated_at = NOW()
    WHERE id = p_case_study_id;

    RETURN true;

END;
$$;


REVOKE ALL
ON FUNCTION public.update_admin_case_study(
    UUID,
    TEXT,
    TEXT,
    TEXT,
    TEXT,
    TEXT,
    TEXT,
    UUID,
    TEXT,
    DATE,
    BOOLEAN,
    BOOLEAN,
    INTEGER,
    TEXT,
    TEXT
)
FROM PUBLIC;


GRANT EXECUTE
ON FUNCTION public.update_admin_case_study(
    UUID,
    TEXT,
    TEXT,
    TEXT,
    TEXT,
    TEXT,
    TEXT,
    UUID,
    TEXT,
    DATE,
    BOOLEAN,
    BOOLEAN,
    INTEGER,
    TEXT,
    TEXT
)
TO authenticated;