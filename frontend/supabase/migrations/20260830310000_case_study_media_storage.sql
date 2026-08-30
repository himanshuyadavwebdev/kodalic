-- ============================================================
-- KODALIC WEBSITE
-- Migration: Case Study Media Storage
-- ============================================================

INSERT INTO storage.buckets (
    id,
    name,
    public
)
VALUES (
    'case-study-media',
    'case-study-media',
    false
)
ON CONFLICT (id) DO NOTHING;