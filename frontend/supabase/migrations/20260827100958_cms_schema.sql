-- ============================================================
-- KODALIC WEBSITE
-- Migration: CMS / Website Content
-- ============================================================


-- ============================================================
-- SITE SETTINGS
-- ============================================================

CREATE TABLE public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- NAVIGATION ITEMS
-- ============================================================

CREATE TABLE public.navigation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    destination_type TEXT NOT NULL,
    target_path TEXT NOT NULL,
    visible BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_navigation_items_order
    ON public.navigation_items(display_order);

CREATE INDEX idx_navigation_items_visible
    ON public.navigation_items(visible);


-- ============================================================
-- HERO CONTENT
-- ============================================================

CREATE TABLE public.hero_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    headline TEXT NOT NULL,
    copy TEXT NOT NULL,
    cta JSONB NOT NULL DEFAULT '{}'::jsonb,
    audience_phrases JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'draft',
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hero_content_status
    ON public.hero_content(status);


-- ============================================================
-- SERVICES
-- ============================================================

CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    cta TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_services_order
    ON public.services(order_index);

CREATE INDEX idx_services_status
    ON public.services(status);


-- ============================================================
-- PROCESS STEPS
-- ============================================================

CREATE TABLE public.process_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_process_steps_order
    ON public.process_steps(order_index);

CREATE INDEX idx_process_steps_status
    ON public.process_steps(status);


-- ============================================================
-- INDUSTRIES
-- ============================================================

CREATE TABLE public.industries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_industries_order
    ON public.industries(order_index);

CREATE INDEX idx_industries_status
    ON public.industries(status);


-- ============================================================
-- TECHNOLOGIES
-- ============================================================

CREATE TABLE public.technologies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    logo_media_id UUID,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    marquee_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_technologies_order
    ON public.technologies(order_index);

CREATE INDEX idx_technologies_active
    ON public.technologies(active);

CREATE INDEX idx_technologies_verified
    ON public.technologies(verified);