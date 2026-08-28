-- ============================================================
-- KODALIC WEBSITE
-- Migration: Media + SEO
-- ============================================================


-- ============================================================
-- MEDIA
-- ============================================================

CREATE TABLE public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    storage_key TEXT NOT NULL UNIQUE,
    filename TEXT NOT NULL,
    mime TEXT NOT NULL,
    size BIGINT NOT NULL,
    dimensions JSONB,
    alt_text TEXT,
    caption TEXT,

    created_by UUID
        REFERENCES public.users(id)
        ON DELETE SET NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_media_created_by
    ON public.media(created_by);

CREATE INDEX idx_media_mime
    ON public.media(mime);


-- ============================================================
-- SEO METADATA
-- ============================================================

CREATE TABLE public.seo_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,

    title TEXT,
    description TEXT,
    canonical TEXT,
    og_media_id UUID,

    indexable BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (entity_type, entity_id)
);

CREATE INDEX idx_seo_metadata_entity
    ON public.seo_metadata(entity_type, entity_id);

CREATE INDEX idx_seo_metadata_indexable
    ON public.seo_metadata(indexable);


-- ============================================================
-- REDIRECTS
-- ============================================================

CREATE TABLE public.redirects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    old_path TEXT NOT NULL UNIQUE,
    new_path TEXT NOT NULL,

    status_code INTEGER NOT NULL DEFAULT 301,
    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT redirects_status_code_check
        CHECK (status_code = 301)
);

CREATE INDEX idx_redirects_active
    ON public.redirects(active);

CREATE INDEX idx_redirects_new_path
    ON public.redirects(new_path);


-- ============================================================
-- MEDIA RELATIONSHIPS
-- ============================================================

ALTER TABLE public.technologies
    ADD CONSTRAINT technologies_logo_media_id_fkey
    FOREIGN KEY (logo_media_id)
    REFERENCES public.media(id)
    ON DELETE SET NULL;


ALTER TABLE public.project_media
    ADD CONSTRAINT project_media_media_id_fkey
    FOREIGN KEY (media_id)
    REFERENCES public.media(id)
    ON DELETE CASCADE;


-- ============================================================
-- SEO MEDIA RELATIONSHIP
-- ============================================================

ALTER TABLE public.seo_metadata
    ADD CONSTRAINT seo_metadata_og_media_id_fkey
    FOREIGN KEY (og_media_id)
    REFERENCES public.media(id)
    ON DELETE SET NULL;