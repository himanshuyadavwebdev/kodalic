-- ============================================================
-- KODALIC WEBSITE
-- Migration: Public Case Studies
-- ============================================================

-- ------------------------------------------------------------
-- PUBLIC CASE STUDY LIST
-- Returns only published Case Studies.
-- Maximum 5 records.
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_public_case_studies()
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    domain TEXT,
    description TEXT,
    client_name TEXT,
    completed_at DATE,
    published BOOLEAN,
    featured BOOLEAN,
    "order" INTEGER,
    hero_media_id UUID,
    hero_storage_key TEXT,
    hero_filename TEXT,
    hero_alt_text TEXT,
    hero_caption TEXT,
    website_url TEXT,
    services JSONB,
    tags JSONB
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT
        cs.id,
        cs.title,
        cs.slug,
        cs.domain,
        cs.description,
        cs.client_name,
        cs.completed_at,
        cs.published,
        cs.featured,
        cs."order",
        cs.hero_media_id,

        hero.storage_key,
        hero.filename,
        hero.alt_text,
        hero.caption,

        cs.website_url,

        COALESCE(
            (
                SELECT jsonb_agg(
                    css.service
                    ORDER BY css.created_at
                )
                FROM public.case_study_services css
                WHERE css.case_study_id = cs.id
            ),
            '[]'::jsonb
        ) AS services,

        COALESCE(
            (
                SELECT jsonb_agg(
                    cst.tag
                    ORDER BY cst.created_at
                )
                FROM public.case_study_tags cst
                WHERE cst.case_study_id = cs.id
            ),
            '[]'::jsonb
        ) AS tags

    FROM public.case_studies cs

    LEFT JOIN public.media hero
        ON hero.id = cs.hero_media_id

    WHERE cs.published = TRUE

    ORDER BY
        cs.featured DESC,
        cs."order" ASC,
        cs.created_at DESC

    LIMIT 5;
$$;


-- ------------------------------------------------------------
-- PUBLIC CASE STUDY DETAIL
-- Returns one published Case Study by slug.
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_public_case_study(
    p_slug TEXT
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    domain TEXT,
    description TEXT,
    story TEXT,
    website_url TEXT,
    client_name TEXT,
    completed_at DATE,
    published BOOLEAN,
    featured BOOLEAN,
    "order" INTEGER,
    seo_title TEXT,
    seo_description TEXT,
    hero_media_id UUID,
    hero_storage_key TEXT,
    hero_filename TEXT,
    hero_alt_text TEXT,
    hero_caption TEXT,
    services JSONB,
    tags JSONB,
    gallery JSONB
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT
        cs.id,
        cs.title,
        cs.slug,
        cs.domain,
        cs.description,
        cs.story,
        cs.website_url,
        cs.client_name,
        cs.completed_at,
        cs.published,
        cs.featured,
        cs."order",
        cs.seo_title,
        cs.seo_description,

        cs.hero_media_id,

        hero.storage_key,
        hero.filename,
        hero.alt_text,
        hero.caption,

        COALESCE(
            (
                SELECT jsonb_agg(
                    css.service
                    ORDER BY css.created_at
                )
                FROM public.case_study_services css
                WHERE css.case_study_id = cs.id
            ),
            '[]'::jsonb
        ) AS services,

        COALESCE(
            (
                SELECT jsonb_agg(
                    cst.tag
                    ORDER BY cst.created_at
                )
                FROM public.case_study_tags cst
                WHERE cst.case_study_id = cs.id
            ),
            '[]'::jsonb
        ) AS tags,

        COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', m.id,
                        'storage_key', m.storage_key,
                        'filename', m.filename,
                        'mime', m.mime,
                        'size', m.size,
                        'dimensions', m.dimensions,
                        'alt_text', m.alt_text,
                        'caption', m.caption,
                        'order', csm."order"
                    )
                    ORDER BY csm."order" ASC
                )
                FROM public.case_study_media csm
                INNER JOIN public.media m
                    ON m.id = csm.media_id
                WHERE csm.case_study_id = cs.id
            ),
            '[]'::jsonb
        ) AS gallery

    FROM public.case_studies cs

    LEFT JOIN public.media hero
        ON hero.id = cs.hero_media_id

    WHERE cs.slug = p_slug
      AND cs.published = TRUE

    LIMIT 1;
$$;


-- ------------------------------------------------------------
-- Public execution permissions
-- ------------------------------------------------------------

REVOKE ALL
ON FUNCTION public.get_public_case_studies()
FROM PUBLIC;

REVOKE ALL
ON FUNCTION public.get_public_case_study(TEXT)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.get_public_case_studies()
TO anon, authenticated;

GRANT EXECUTE
ON FUNCTION public.get_public_case_study(TEXT)
TO anon, authenticated;