-- ============================================================
-- KODALIC WEBSITE
-- RBAC SECURITY
-- ============================================================


-- ============================================================
-- 1. RBAC HELPER FUNCTION
-- ============================================================
-- Checks whether a user has a specific permission.
--
-- Example:
--
-- has_permission('projects.update')
--
-- Returns:
-- true  -> permission exists
-- false -> permission does not exist
--
-- SECURITY DEFINER is used so the function can safely inspect
-- the RBAC tables even though those tables themselves are
-- protected by RLS.
-- ============================================================

CREATE OR REPLACE FUNCTION public.has_permission(
    p_permission_key TEXT,
    p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles ur
        INNER JOIN public.role_permissions rp
            ON rp.role_id = ur.role_id
        INNER JOIN public.permissions p
            ON p.id = rp.permission_id
        WHERE ur.user_id = p_user_id
          AND p.key = p_permission_key
    );
$$;


-- ============================================================
-- 2. PROTECT THE FUNCTION
-- ============================================================
-- Nobody should be able to modify the function from the
-- client side.
-- ============================================================

REVOKE ALL
ON FUNCTION public.has_permission(TEXT, UUID)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.has_permission(TEXT, UUID)
TO authenticated;


-- ============================================================
-- 3. STANDARD PERMISSIONS
-- ============================================================
-- These permission keys correspond to the operations described
-- in the client API / authorization contract.
-- ============================================================

INSERT INTO public.permissions (key)
VALUES
    ('leads.view'),
    ('leads.update'),
    ('leads.export'),

    ('projects.view'),
    ('projects.create'),
    ('projects.update'),
    ('projects.delete'),

    ('blog.view'),
    ('blog.create'),
    ('blog.update'),
    ('blog.delete'),

    ('content.view'),
    ('content.create'),
    ('content.update'),
    ('content.delete'),

    ('media.view'),
    ('media.create'),
    ('media.update'),
    ('media.delete'),

    ('seo.view'),
    ('seo.update'),

    ('analytics.view')
ON CONFLICT (key) DO NOTHING;