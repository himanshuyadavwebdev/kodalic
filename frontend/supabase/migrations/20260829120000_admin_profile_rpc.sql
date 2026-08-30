-- ============================================================
-- KODALIC WEBSITE
-- Admin Profile RPC
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_my_admin_profile()
RETURNS TABLE (
    id UUID,
    email TEXT,
    name TEXT,
    role TEXT
)
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT
        u.id,
        u.email,
        u.name,
        STRING_AGG(r.name, ', ' ORDER BY r.name) AS role
    FROM public.users u
    INNER JOIN public.user_roles ur
        ON ur.user_id = u.id
    INNER JOIN public.roles r
        ON r.id = ur.role_id
    WHERE u.id = auth.uid()
    GROUP BY
        u.id,
        u.email,
        u.name;
$$;

-- ============================================================
-- Protect the function
-- ============================================================

REVOKE ALL
ON FUNCTION public.get_my_admin_profile()
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.get_my_admin_profile()
TO authenticated;