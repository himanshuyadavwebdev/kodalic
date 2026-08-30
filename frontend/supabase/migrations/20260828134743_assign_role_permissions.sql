-- ============================================================
-- KODALIC WEBSITE
-- RBAC ROLE → PERMISSION ASSIGNMENTS
-- ============================================================


-- ============================================================
-- ADMIN
-- Full operational access.
-- No user / role management permissions exist.
-- ============================================================

INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'Admin'
  AND p.key IN (
    'analytics.view',

    'leads.view',
    'leads.update',
    'leads.export',

    'projects.view',
    'projects.create',
    'projects.update',
    'projects.delete',

    'blog.view',
    'blog.create',
    'blog.update',
    'blog.delete',

    'content.view',
    'content.create',
    'content.update',
    'content.delete',

    'media.view',
    'media.create',
    'media.update',
    'media.delete',

    'seo.view',
    'seo.update'
  )
ON CONFLICT DO NOTHING;


-- ============================================================
-- MANAGER
-- Business / CMS management.
-- No destructive delete permissions.
-- ============================================================

INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'Manager'
  AND p.key IN (
    'analytics.view',

    'leads.view',
    'leads.update',
    'leads.export',

    'projects.view',
    'projects.create',
    'projects.update',

    'blog.view',
    'blog.create',
    'blog.update',

    'content.view',
    'content.create',
    'content.update',

    'media.view',
    'media.create',
    'media.update',

    'seo.view',
    'seo.update'
  )
ON CONFLICT DO NOTHING;


-- ============================================================
-- DEVELOPER
-- Explicitly assigned technical permissions only.
-- No leads, analytics, SEO, or delete permissions.
-- ============================================================

INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'Developer'
  AND p.key IN (
    'projects.view',
    'projects.create',
    'projects.update',

    'blog.view',

    'content.view',

    'media.view',
    'media.create',
    'media.update'
  )
ON CONFLICT DO NOTHING;