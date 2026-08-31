-- ============================================================
-- KODALIC WEBSITE
-- Migration: Case Study Role Permissions
-- ============================================================

-- ADMIN
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT
    'd50c4192-5b0d-42da-b079-548ef8bd8f7e',
    p.id
FROM public.permissions p
WHERE p.key IN (
    'case_studies.view',
    'case_studies.create',
    'case_studies.update',
    'case_studies.delete'
)
ON CONFLICT DO NOTHING;


-- MANAGER
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT
    '84139c0a-b606-4712-bc8c-bfca54c4445d',
    p.id
FROM public.permissions p
WHERE p.key IN (
    'case_studies.view',
    'case_studies.create',
    'case_studies.update'
)
ON CONFLICT DO NOTHING;


-- DEVELOPER
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT
    'd59426ca-b854-4762-a8b6-656ab593bef0',
    p.id
FROM public.permissions p
WHERE p.key IN (
    'case_studies.view',
    'case_studies.create',
    'case_studies.update'
)
ON CONFLICT DO NOTHING;