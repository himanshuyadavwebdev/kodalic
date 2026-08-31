-- ============================================================
-- KODALIC WEBSITE
-- REMOVE OLD UNSAFE PERMISSION FUNCTION
-- ============================================================

DROP FUNCTION IF EXISTS public.has_permission(TEXT, UUID);