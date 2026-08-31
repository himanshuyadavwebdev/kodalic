-- ============================================================
-- KODALIC WEBSITE
-- Migration: Case Studies
-- ============================================================


-- ============================================================
-- CASE STUDIES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.case_studies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,

    domain TEXT NOT NULL,
    description TEXT NOT NULL,

    story TEXT NOT NULL,

    website_url TEXT,

    hero_media_id UUID REFERENCES public.media(id)
        ON DELETE SET NULL,

    client_name TEXT,

    completed_at DATE,

    published BOOLEAN NOT NULL DEFAULT false,

    featured BOOLEAN NOT NULL DEFAULT false,

    "order" INTEGER NOT NULL DEFAULT 999,

    seo_title TEXT,

    seo_description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- CASE STUDY TAGS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.case_study_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    case_study_id UUID NOT NULL
        REFERENCES public.case_studies(id)
        ON DELETE CASCADE,

    tag TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(case_study_id, tag)
);


-- ============================================================
-- CASE STUDY SERVICES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.case_study_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    case_study_id UUID NOT NULL
        REFERENCES public.case_studies(id)
        ON DELETE CASCADE,

    service TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(case_study_id, service)
);


-- ============================================================
-- CASE STUDY MEDIA
-- ============================================================

CREATE TABLE IF NOT EXISTS public.case_study_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    case_study_id UUID NOT NULL
        REFERENCES public.case_studies(id)
        ON DELETE CASCADE,

    media_id UUID NOT NULL
        REFERENCES public.media(id)
        ON DELETE CASCADE,

    "order" INTEGER NOT NULL DEFAULT 999,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(case_study_id, media_id)
);


-- ============================================================
-- CASE STUDY STATS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.case_study_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    case_study_id UUID NOT NULL
        REFERENCES public.case_studies(id)
        ON DELETE CASCADE,

    label TEXT NOT NULL,
    value TEXT NOT NULL,

    "order" INTEGER NOT NULL DEFAULT 999,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_case_studies_published
    ON public.case_studies(published);

CREATE INDEX IF NOT EXISTS idx_case_studies_featured
    ON public.case_studies(featured);

CREATE INDEX IF NOT EXISTS idx_case_studies_order
    ON public.case_studies("order");

CREATE INDEX IF NOT EXISTS idx_case_studies_domain
    ON public.case_studies(domain);

CREATE INDEX IF NOT EXISTS idx_case_study_tags_case_study_id
    ON public.case_study_tags(case_study_id);

CREATE INDEX IF NOT EXISTS idx_case_study_services_case_study_id
    ON public.case_study_services(case_study_id);

CREATE INDEX IF NOT EXISTS idx_case_study_media_case_study_id
    ON public.case_study_media(case_study_id);

CREATE INDEX IF NOT EXISTS idx_case_study_stats_case_study_id
    ON public.case_study_stats(case_study_id);