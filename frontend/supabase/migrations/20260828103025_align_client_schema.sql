-- ============================================================
-- KODALIC WEBSITE
-- Migration: Align database with client schema
-- ============================================================


-- ============================================================
-- NAVIGATION ITEMS
-- ============================================================

ALTER TABLE public.navigation_items
    RENAME COLUMN target_path TO approved_path;

ALTER TABLE public.navigation_items
    RENAME COLUMN display_order TO "order";


-- ============================================================
-- SERVICES
-- ============================================================

ALTER TABLE public.services
    RENAME COLUMN order_index TO "order";


-- ============================================================
-- PROCESS STEPS
-- ============================================================

ALTER TABLE public.process_steps
    RENAME COLUMN order_index TO "order";


-- ============================================================
-- INDUSTRIES
-- ============================================================

ALTER TABLE public.industries
    RENAME COLUMN order_index TO "order";


-- ============================================================
-- TECHNOLOGIES
-- ============================================================

ALTER TABLE public.technologies
    RENAME COLUMN order_index TO "order";


-- ============================================================
-- PROJECTS
-- ============================================================

ALTER TABLE public.projects
    ADD COLUMN solution_type TEXT;

ALTER TABLE public.projects
    ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE public.projects
    DROP COLUMN summary;

ALTER TABLE public.projects
    DROP COLUMN repo_url;


-- ============================================================
-- PROJECT MEDIA
-- ============================================================

ALTER TABLE public.project_media
    ADD COLUMN type TEXT NOT NULL DEFAULT 'image';

ALTER TABLE public.project_media
    RENAME COLUMN display_order TO "order";


-- ============================================================
-- PROJECT HIGHLIGHTS
-- ============================================================

ALTER TABLE public.project_highlights
    ADD COLUMN text TEXT;

UPDATE public.project_highlights
SET text = CONCAT_WS(' — ', title, description);

ALTER TABLE public.project_highlights
    ALTER COLUMN text SET NOT NULL;

ALTER TABLE public.project_highlights
    DROP COLUMN title;

ALTER TABLE public.project_highlights
    DROP COLUMN description;

ALTER TABLE public.project_highlights
    RENAME COLUMN display_order TO "order";


-- ============================================================
-- TESTIMONIALS
-- ============================================================

ALTER TABLE public.testimonials
    RENAME COLUMN display_order TO "order";