-- ============================================================
-- KODALIC WEBSITE
-- Migration: Admin Blog Management
-- ============================================================


-- ============================================================
-- GET ADMIN BLOG POSTS
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_admin_blog_posts()
RETURNS TABLE (
    id UUID,
    slug TEXT,
    title TEXT,
    excerpt TEXT,
    content TEXT,
    author_id UUID,
    status TEXT,
    published_at TIMESTAMPTZ,
    category_id UUID,
    cover_media_id UUID,
    featured BOOLEAN,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN

    IF NOT public.has_permission('blog.view') THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    RETURN QUERY
    SELECT
        bp.id,
        bp.slug,
        bp.title,
        bp.excerpt,
        bp.content,
        bp.author_id,
        bp.status,
        bp.published_at,
        bp.category_id,
        bp.cover_media_id,
        bp.featured,
        bp.created_at,
        bp.updated_at
    FROM public.blog_posts bp
    ORDER BY
        CASE
            WHEN bp.status = 'published' THEN 0
            ELSE 1
        END,
        bp.published_at DESC NULLS LAST,
        bp.created_at DESC;

END;
$function$;


-- ============================================================
-- CREATE ADMIN BLOG POST
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_admin_blog_post(
    p_slug TEXT,
    p_title TEXT,
    p_excerpt TEXT,
    p_content TEXT,
    p_author_id UUID,
    p_status TEXT,
    p_published_at TIMESTAMPTZ,
    p_category_id UUID,
    p_cover_media_id UUID,
    p_featured BOOLEAN
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    v_post_id UUID;
    v_status TEXT;
BEGIN

    IF NOT public.has_permission('blog.create') THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    IF trim(COALESCE(p_title, '')) = '' THEN
        RAISE EXCEPTION 'Blog title is required';
    END IF;

    IF trim(COALESCE(p_slug, '')) = '' THEN
        RAISE EXCEPTION 'Blog slug is required';
    END IF;

    IF trim(COALESCE(p_content, '')) = '' THEN
        RAISE EXCEPTION 'Blog content is required';
    END IF;

    v_status = lower(trim(COALESCE(p_status, 'draft')));

    IF v_status NOT IN ('draft', 'published') THEN
        RAISE EXCEPTION 'Blog status must be draft or published';
    END IF;

    IF v_status = 'published'
       AND NOT public.has_permission('blog.publish')
    THEN
        RAISE EXCEPTION 'Permission denied: blog.publish required';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.blog_posts
        WHERE slug = trim(p_slug)
    ) THEN
        RAISE EXCEPTION
            'A blog post with this slug already exists';
    END IF;

    IF p_category_id IS NOT NULL
       AND NOT EXISTS (
           SELECT 1
           FROM public.blog_categories
           WHERE id = p_category_id
       )
    THEN
        RAISE EXCEPTION 'Blog category not found';
    END IF;

    IF p_cover_media_id IS NOT NULL
       AND NOT EXISTS (
           SELECT 1
           FROM public.media
           WHERE id = p_cover_media_id
       )
    THEN
        RAISE EXCEPTION 'Blog cover media not found';
    END IF;

    INSERT INTO public.blog_posts (
        slug,
        title,
        excerpt,
        content,
        author_id,
        status,
        published_at,
        category_id,
        cover_media_id,
        featured
    )
    VALUES (
        trim(p_slug),
        trim(p_title),
        NULLIF(trim(COALESCE(p_excerpt, '')), ''),
        trim(p_content),
        p_author_id,
        v_status,
        CASE
            WHEN v_status = 'published'
            THEN COALESCE(p_published_at, NOW())
            ELSE NULL
        END,
        p_category_id,
        p_cover_media_id,
        COALESCE(p_featured, false)
    )
    RETURNING id INTO v_post_id;

    RETURN v_post_id;

END;
$function$;


-- ============================================================
-- UPDATE ADMIN BLOG POST
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_admin_blog_post(
    p_post_id UUID,
    p_slug TEXT,
    p_title TEXT,
    p_excerpt TEXT,
    p_content TEXT,
    p_author_id UUID,
    p_status TEXT,
    p_published_at TIMESTAMPTZ,
    p_category_id UUID,
    p_cover_media_id UUID,
    p_featured BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    v_status TEXT;
    v_current_status TEXT;
BEGIN

    IF NOT public.has_permission('blog.update') THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    IF p_post_id IS NULL THEN
        RAISE EXCEPTION 'Blog post ID is required';
    END IF;

    IF trim(COALESCE(p_title, '')) = '' THEN
        RAISE EXCEPTION 'Blog title is required';
    END IF;

    IF trim(COALESCE(p_slug, '')) = '' THEN
        RAISE EXCEPTION 'Blog slug is required';
    END IF;

    IF trim(COALESCE(p_content, '')) = '' THEN
        RAISE EXCEPTION 'Blog content is required';
    END IF;

    v_status = lower(trim(COALESCE(p_status, 'draft')));

    IF v_status NOT IN ('draft', 'published') THEN
        RAISE EXCEPTION 'Blog status must be draft or published';
    END IF;

    SELECT status
    INTO v_current_status
    FROM public.blog_posts
    WHERE id = p_post_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Blog post not found';
    END IF;

    IF v_status = 'published'
       AND NOT public.has_permission('blog.publish')
    THEN
        RAISE EXCEPTION 'Permission denied: blog.publish required';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.blog_posts
        WHERE slug = trim(p_slug)
          AND id <> p_post_id
    ) THEN
        RAISE EXCEPTION
            'A blog post with this slug already exists';
    END IF;

    IF p_category_id IS NOT NULL
       AND NOT EXISTS (
           SELECT 1
           FROM public.blog_categories
           WHERE id = p_category_id
       )
    THEN
        RAISE EXCEPTION 'Blog category not found';
    END IF;

    IF p_cover_media_id IS NOT NULL
       AND NOT EXISTS (
           SELECT 1
           FROM public.media
           WHERE id = p_cover_media_id
       )
    THEN
        RAISE EXCEPTION 'Blog cover media not found';
    END IF;

    UPDATE public.blog_posts
    SET
        slug = trim(p_slug),
        title = trim(p_title),
        excerpt =
            NULLIF(
                trim(COALESCE(p_excerpt, '')),
                ''
            ),
        content = trim(p_content),
        author_id = p_author_id,
        status = v_status,
        published_at =
            CASE
                WHEN v_status = 'published'
                THEN COALESCE(
                    p_published_at,
                    CASE
                        WHEN v_current_status = 'published'
                        THEN published_at
                        ELSE NOW()
                    END
                )
                ELSE NULL
            END,
        category_id = p_category_id,
        cover_media_id = p_cover_media_id,
        featured = COALESCE(p_featured, false),
        updated_at = NOW()
    WHERE id = p_post_id;

    RETURN true;

END;
$function$;


-- ============================================================
-- DELETE ADMIN BLOG POST
-- ============================================================

CREATE OR REPLACE FUNCTION public.delete_admin_blog_post(
    p_post_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN

    IF NOT public.has_permission('blog.delete') THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    IF p_post_id IS NULL THEN
        RAISE EXCEPTION 'Blog post ID is required';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM public.blog_posts
        WHERE id = p_post_id
    ) THEN
        RAISE EXCEPTION 'Blog post not found';
    END IF;

    DELETE FROM public.blog_posts
    WHERE id = p_post_id;

    RETURN true;

END;
$function$;


-- ============================================================
-- ADMIN BLOG RELATIONSHIPS
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_admin_blog_relationships(
    p_post_id UUID,
    p_tag_ids UUID[]
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN

    IF NOT public.has_permission('blog.update') THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    IF p_post_id IS NULL THEN
        RAISE EXCEPTION 'Blog post ID is required';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM public.blog_posts
        WHERE id = p_post_id
    ) THEN
        RAISE EXCEPTION 'Blog post not found';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM unnest(
            COALESCE(
                p_tag_ids,
                ARRAY[]::UUID[]
            )
        ) AS supplied_tag_id
        WHERE NOT EXISTS (
            SELECT 1
            FROM public.blog_tags bt
            WHERE bt.id = supplied_tag_id
        )
    ) THEN
        RAISE EXCEPTION 'One or more blog tags were not found';
    END IF;

    DELETE FROM public.blog_post_tags
    WHERE post_id = p_post_id;

    INSERT INTO public.blog_post_tags (
        post_id,
        tag_id
    )
    SELECT
        p_post_id,
        tag_id
    FROM unnest(
        COALESCE(
            p_tag_ids,
            ARRAY[]::UUID[]
        )
    ) AS tag_id
    GROUP BY tag_id;

    RETURN true;

END;
$function$;