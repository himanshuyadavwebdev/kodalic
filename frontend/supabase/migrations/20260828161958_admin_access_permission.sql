-- ============================================================
-- KODALIC WEBSITE
-- ADMIN PANEL ACCESS PERMISSION
-- ============================================================

INSERT INTO public.permissions (key)
VALUES ('admin.access')
ON CONFLICT (key) DO NOTHING;


-- Give Admin, Manager and Developer access to the admin panel.

INSERT INTO public.role_permissions (role_id, permission_id)
SELECT
    r.id,
    p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE p.key = 'admin.access'
  AND r.name IN ('Admin', 'Manager', 'Developer')
ON CONFLICT DO NOTHING;