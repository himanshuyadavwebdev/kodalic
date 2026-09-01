-- ============================================================
-- KODALIC WEBSITE
-- Migration: Portfolio
-- ============================================================


-- ============================================================
-- PROJECTS
-- ============================================================

CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,

    category_id UUID,

    featured BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'draft',

    live_url TEXT,
    repo_url TEXT,

    published_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_category_id
    ON public.projects(category_id);

CREATE INDEX idx_projects_status
    ON public.projects(status);

CREATE INDEX idx_projects_featured
    ON public.projects(featured);


-- ============================================================
-- PROJECT MEDIA
-- ============================================================

CREATE TABLE public.project_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL
        REFERENCES public.projects(id)
        ON DELETE CASCADE,

    media_id UUID NOT NULL,

    display_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_project_media_project_id
    ON public.project_media(project_id);

CREATE INDEX idx_project_media_media_id
    ON public.project_media(media_id);

CREATE INDEX idx_project_media_order
    ON public.project_media(project_id, display_order);


-- ============================================================
-- PROJECT TECHNOLOGIES
-- ============================================================

CREATE TABLE public.project_technologies (
    project_id UUID NOT NULL
        REFERENCES public.projects(id)
        ON DELETE CASCADE,

    technology_id UUID NOT NULL
        REFERENCES public.technologies(id)
        ON DELETE CASCADE,

    PRIMARY KEY (project_id, technology_id)
);

CREATE INDEX idx_project_technologies_technology_id
    ON public.project_technologies(technology_id);


-- ============================================================
-- PROJECT HIGHLIGHTS
-- ============================================================

CREATE TABLE public.project_highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL
        REFERENCES public.projects(id)
        ON DELETE CASCADE,

    title TEXT NOT NULL,
    description TEXT NOT NULL,

    display_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_project_highlights_project_id
    ON public.project_highlights(project_id);

CREATE INDEX idx_project_highlights_order
    ON public.project_highlights(project_id, display_order);