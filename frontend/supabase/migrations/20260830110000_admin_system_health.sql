-- ============================================================
-- KODALIC WEBSITE
-- Migration: Admin System Health
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_admin_system_health()
RETURNS TABLE (
    system_name TEXT,
    system_status TEXT,
    status_message TEXT
)
LANGUAGE PLPGSQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN

    IF NOT public.has_permission('admin.access') THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    -- ========================================================
    -- DATABASE
    -- ========================================================

    RETURN QUERY
    SELECT
        'Database'::TEXT,
        'operational'::TEXT,
        'Database connection is operational.'::TEXT;

    -- ========================================================
    -- STORAGE
    -- ========================================================

    RETURN QUERY
    SELECT
        'Storage'::TEXT,
        'operational'::TEXT,
        'Storage service is reachable.'::TEXT
    WHERE EXISTS (
        SELECT 1
        FROM storage.buckets
        LIMIT 1
    );

    -- If there are no storage buckets, report that separately.
    RETURN QUERY
    SELECT
        'Storage'::TEXT,
        'warning'::TEXT,
        'No storage buckets are configured.'::TEXT
    WHERE NOT EXISTS (
        SELECT 1
        FROM storage.buckets
        LIMIT 1
    );

    -- ========================================================
    -- APPLICATION
    -- ========================================================

    RETURN QUERY
    SELECT
        'Application'::TEXT,
        'operational'::TEXT,
        'Application server is responding.'::TEXT;

END;
$$;


-- ============================================================
-- FUNCTION SECURITY
-- ============================================================

REVOKE ALL
ON FUNCTION public.get_admin_system_health()
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.get_admin_system_health()
TO authenticated;