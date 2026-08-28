-- ============================================================
-- KODALIC WEBSITE
-- RLS SECURITY
-- ============================================================


-- ============================================================
-- 1. ENABLE ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_highlights ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 2. PUBLIC WEBSITE — NAVIGATION
-- ============================================================

CREATE POLICY "Public can read visible navigation"
ON public.navigation_items
FOR SELECT
TO anon, authenticated
USING (visible = true);


-- ============================================================
-- 3. PUBLIC WEBSITE — HERO
-- ============================================================

CREATE POLICY "Public can read published hero"
ON public.hero_content
FOR SELECT
TO anon, authenticated
USING (status = 'published');


-- ============================================================
-- 4. PUBLIC WEBSITE — SERVICES
-- ============================================================

CREATE POLICY "Public can read published services"
ON public.services
FOR SELECT
TO anon, authenticated
USING (status = 'published');


-- ============================================================
-- 5. PUBLIC WEBSITE — PROCESS STEPS
-- ============================================================

CREATE POLICY "Public can read published process steps"
ON public.process_steps
FOR SELECT
TO anon, authenticated
USING (status = 'published');


-- ============================================================
-- 6. PUBLIC WEBSITE — INDUSTRIES
-- ============================================================

CREATE POLICY "Public can read published industries"
ON public.industries
FOR SELECT
TO anon, authenticated
USING (status = 'published');


-- ============================================================
-- 7. PUBLIC WEBSITE — TECHNOLOGIES
-- ============================================================

CREATE POLICY "Public can read active verified technologies"
ON public.technologies
FOR SELECT
TO anon, authenticated
USING (
    active = true
    AND verified = true
    AND marquee_enabled = true
);


-- ============================================================
-- 8. PUBLIC WEBSITE — PROJECTS
-- ============================================================

CREATE POLICY "Public can read published projects"
ON public.projects
FOR SELECT
TO anon, authenticated
USING (status = 'published');


-- ============================================================
-- 9. PUBLIC WEBSITE — PROJECT MEDIA
-- ============================================================

CREATE POLICY "Public can read media for published projects"
ON public.project_media
FOR SELECT
TO anon, authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = project_media.project_id
        AND p.status = 'published'
    )
);


-- ============================================================
-- 10. PUBLIC WEBSITE — PROJECT TECHNOLOGIES
-- ============================================================

CREATE POLICY "Public can read technologies for published projects"
ON public.project_technologies
FOR SELECT
TO anon, authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = project_technologies.project_id
        AND p.status = 'published'
    )
);


-- ============================================================
-- 11. PUBLIC WEBSITE — PROJECT HIGHLIGHTS
-- ============================================================

CREATE POLICY "Public can read highlights for published projects"
ON public.project_highlights
FOR SELECT
TO anon, authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = project_highlights.project_id
        AND p.status = 'published'
    )
);


-- ============================================================
-- 12. PUBLIC WEBSITE — TESTIMONIALS
-- ============================================================

CREATE POLICY "Public can read approved testimonials"
ON public.testimonials
FOR SELECT
TO anon, authenticated
USING (
    status = 'published'
    AND verified = true
    AND consent_confirmed = true
);


-- ============================================================
-- 13. PUBLIC WEBSITE — BLOG POSTS
-- ============================================================

CREATE POLICY "Public can read published blog posts"
ON public.blog_posts
FOR SELECT
TO anon, authenticated
USING (status = 'published');


-- ============================================================
-- 14. PUBLIC WEBSITE — BLOG CATEGORIES
-- ============================================================

CREATE POLICY "Public can read blog categories"
ON public.blog_categories
FOR SELECT
TO anon, authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.blog_posts bp
        WHERE bp.status = 'published'
    )
);


-- ============================================================
-- 15. PUBLIC WEBSITE — BLOG TAGS
-- ============================================================

CREATE POLICY "Public can read tags used by published posts"
ON public.blog_tags
FOR SELECT
TO anon, authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.blog_post_tags bpt
        JOIN public.blog_posts bp
            ON bp.id = bpt.post_id
        WHERE bpt.tag_id = blog_tags.id
        AND bp.status = 'published'
    )
);


-- ============================================================
-- 16. PUBLIC WEBSITE — BLOG POST TAG RELATION
-- ============================================================

CREATE POLICY "Public can read tags for published posts"
ON public.blog_post_tags
FOR SELECT
TO anon, authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.blog_posts bp
        WHERE bp.id = blog_post_tags.post_id
        AND bp.status = 'published'
    )
);


-- ============================================================
-- 17. PUBLIC WEBSITE — REDIRECTS
-- ============================================================

CREATE POLICY "Public can read active redirects"
ON public.redirects
FOR SELECT
TO anon, authenticated
USING (
    active = true
    AND status_code = 301
);


-- ============================================================
-- 18. PUBLIC WEBSITE — SEO
-- ============================================================

CREATE POLICY "Public can read indexable SEO metadata"
ON public.seo_metadata
FOR SELECT
TO anon, authenticated
USING (indexable = true);


-- ============================================================
-- 19. PUBLIC WEBSITE — LEAD CREATION
-- ============================================================

CREATE POLICY "Public can create leads"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);


-- ============================================================
-- 20. EVERYTHING ELSE
-- ============================================================
-- Because RLS is enabled and there are no policies allowing
-- public access, the following remain inaccessible to the
-- public by default:
--
-- users
-- roles
-- permissions
-- user_roles
-- role_permissions
-- site_settings
-- media
-- lead_notes
-- lead_events
-- notifications
-- audit_logs
-- content_versions