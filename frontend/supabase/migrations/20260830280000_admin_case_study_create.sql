-- ============================================================
-- KODALIC WEBSITE
-- Migration: Admin Case Study Create
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_admin_case_study(
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
RETURNS UUID
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_case_study_id UUID;
    v_published_count INTEGER;
BEGIN

    IF NOT public.has_permission('case_studies.create') THEN
        RAISE EXCEPTION 'Permission denied';
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

    IF EXISTS (
        SELECT 1
        FROM public.case_studies
        WHERE slug = trim(p_slug)
    ) THEN
        RAISE EXCEPTION 'A case study with this slug already exists';
    END IF;

    IF COALESCE(p_published, false) THEN

        SELECT COUNT(*)
        INTO v_published_count
        FROM public.case_studies
        WHERE published = true;

        IF v_published_count >= 5 THEN
            RAISE EXCEPTION
                'Maximum of 5 published case studies allowed';
        END IF;

    END IF;

    INSERT INTO public.case_studies (
        title,
        slug,
        domain,
        description,
        story,
        website_url,
        hero_media_id,
        client_name,
        completed_at,
        published,
        featured,
        "order",
        seo_title,
        seo_description
    )
    VALUES (
        trim(p_title),
        trim(p_slug),
        trim(p_domain),
        trim(p_description),
        trim(p_story),
        NULLIF(trim(COALESCE(p_website_url, '')), ''),
        p_hero_media_id,
        NULLIF(trim(COALESCE(p_client_name, '')), ''),
        p_completed_at,
        COALESCE(p_published, false),
        COALESCE(p_featured, false),
        COALESCE(p_order, 999),
        NULLIF(trim(COALESCE(p_seo_title, '')), ''),
        NULLIF(trim(COALESCE(p_seo_description, '')), '')
    )
    RETURNING id INTO v_case_study_id;

    RETURN v_case_study_id;

END;
$$;


REVOKE ALL
ON FUNCTION public.create_admin_case_study(
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
ON FUNCTION public.create_admin_case_study(
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