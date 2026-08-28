-- ============================================================
-- KODALIC WEBSITE
-- RBAC ROLES
-- ============================================================

INSERT INTO public.roles (name)
VALUES
    ('Admin'),
    ('Manager'),
    ('Developer')
ON CONFLICT (name) DO NOTHING;