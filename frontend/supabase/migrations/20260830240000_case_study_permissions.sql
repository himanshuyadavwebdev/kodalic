-- ============================================================
-- KODALIC WEBSITE
-- Migration: Case Study Permissions
-- ============================================================

INSERT INTO public.permissions (key)
VALUES
    ('case_studies.create'),
    ('case_studies.view'),
    ('case_studies.update'),
    ('case_studies.delete')
ON CONFLICT (key) DO NOTHING;