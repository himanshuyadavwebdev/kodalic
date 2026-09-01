-- ============================================================
-- KODALIC WEBSITE
-- Migration: Blog + Testimonials
-- ============================================================


-- ============================================================
-- TESTIMONIALS
-- ============================================================

CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    quote TEXT NOT NULL,
    client_name TEXT NOT NULL,
    role TEXT,
    company TEXT,

    media_ids JSONB NOT NULL DEFAULT '[]'::jsonb,

    verified BOOLEAN NOT NULL DEFAULT FALSE,
    consent_confirmed BOOLEAN NOT NULL DEFAULT FALSE,

    status TEXT NOT NULL DEFAULT 'draft',
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT testimonials_publish_verification_check
        CHECK (
            status <> 'published'
            OR (
                verified = TRUE
                AND consent_confirmed = TRUE
            )
        )
);

CREATE INDEX idx_testimonials_status
    ON public.testimonials(status);

CREATE INDEX idx_testimonials_featured
    ON public.testimonials(featured);

CREATE INDEX idx_testimonials_order
    ON public.testimonials(display_order);


-- ============================================================
-- BLOG CATEGORIES
-- ============================================================

CREATE TABLE public.blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- BLOG POSTS
-- ============================================================

CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,

    author_id UUID
        REFERENCES public.users(id)
        ON DELETE SET NULL,

    status TEXT NOT NULL DEFAULT 'draft',
    published_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_author_id
    ON public.blog_posts(author_id);

CREATE INDEX idx_blog_posts_status
    ON public.blog_posts(status);

CREATE INDEX idx_blog_posts_published_at
    ON public.blog_posts(published_at);


-- ============================================================
-- BLOG TAGS
-- ============================================================

CREATE TABLE public.blog_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- BLOG POST TAGS
-- ============================================================

CREATE TABLE public.blog_post_tags (
    post_id UUID NOT NULL
        REFERENCES public.blog_posts(id)
        ON DELETE CASCADE,

    tag_id UUID NOT NULL
        REFERENCES public.blog_tags(id)
        ON DELETE CASCADE,

    PRIMARY KEY (post_id, tag_id)
);

CREATE INDEX idx_blog_post_tags_tag_id
    ON public.blog_post_tags(tag_id);