-- ============================================================
-- KODALIC WEBSITE
-- SECURE RBAC PERMISSION CHECK
-- ============================================================

CREATE OR REPLACE FUNCTION public.has_permission(
    p_permission_key TEXT
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
        WHERE ur.user_id = auth.uid()
          AND p.key = p_permission_key
    );
$$;

REVOKE ALL
ON FUNCTION public.has_permission(TEXT)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.has_permission(TEXT)
TO authenticated;