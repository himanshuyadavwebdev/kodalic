-- ============================================================
-- KODALIC WEBSITE
-- Migration: Admin Current User
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_admin_current_user()
RETURNS TABLE (
    id UUID,
    email TEXT,
    name TEXT,
    role TEXT
)
LANGUAGE PLPGSQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN

    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;

    RETURN QUERY
    SELECT
        u.id,
        u.email,
        u.name,
        COALESCE(
            (
                SELECT r.name
                FROM public.user_roles ur
                INNER JOIN public.roles r
                    ON r.id = ur.role_id
                WHERE ur.user_id = u.id
                LIMIT 1
            ),
            'unknown'
        ) AS role
    FROM public.users u
    WHERE u.id = auth.uid()
      AND u.status = 'active';

END;
$$;


REVOKE ALL
ON FUNCTION public.get_admin_current_user()
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.get_admin_current_user()
TO authenticated;