-- ============================================================
-- KODALIC WEBSITE
-- Migration: Admin Users Lookup
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_admin_users()
RETURNS TABLE (
    id UUID,
    name TEXT,
    email TEXT
)
LANGUAGE PLPGSQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN

    IF NOT public.has_permission('leads.view') THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    RETURN QUERY
    SELECT
        u.id,
        u.name,
        u.email
    FROM public.users u
    WHERE u.status = 'active'
    ORDER BY u.name ASC;

END;
$$;


REVOKE ALL
ON FUNCTION public.get_admin_users()
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.get_admin_users()
TO authenticated;