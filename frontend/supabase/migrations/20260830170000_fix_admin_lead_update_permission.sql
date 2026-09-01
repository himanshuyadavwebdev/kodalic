-- ============================================================
-- KODALIC WEBSITE
-- Migration: Fix Admin Lead Update Permission
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_admin_lead(
    p_lead_id UUID,
    p_status TEXT DEFAULT NULL,
    p_assigned_user_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_actor_id UUID;
    v_old_status TEXT;
    v_old_assigned_user_id UUID;
    v_new_status TEXT;
    v_new_assigned_user_id UUID;
BEGIN

    -- ========================================================
    -- AUTHENTICATION
    -- ========================================================

    v_actor_id := auth.uid();

    IF v_actor_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;

    -- ========================================================
    -- AUTHORIZATION
    -- has_permission() already uses auth.uid()
    -- ========================================================

    IF NOT public.has_permission('leads.update') THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    -- ========================================================
    -- LOAD CURRENT LEAD
    -- ========================================================

    SELECT
        status,
        assigned_user_id
    INTO
        v_old_status,
        v_old_assigned_user_id
    FROM public.leads
    WHERE id = p_lead_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Lead not found';
    END IF;

    -- ========================================================
    -- DETERMINE NEW VALUES
    -- ========================================================

    v_new_status := COALESCE(
        p_status,
        v_old_status
    );

    v_new_assigned_user_id := COALESCE(
        p_assigned_user_id,
        v_old_assigned_user_id
    );

    -- ========================================================
    -- VALIDATE STATUS
    -- ========================================================

    IF v_new_status NOT IN (
        'new',
        'reviewed',
        'transferred_to_crm',
        'archived',
        'spam'
    ) THEN
        RAISE EXCEPTION 'Invalid lead status';
    END IF;

    -- ========================================================
    -- VALIDATE ASSIGNED USER
    -- ========================================================

    IF v_new_assigned_user_id IS NOT NULL
       AND NOT EXISTS (
            SELECT 1
            FROM public.users
            WHERE id = v_new_assigned_user_id
              AND status = 'active'
       )
    THEN
        RAISE EXCEPTION 'Assigned user not found or inactive';
    END IF;

    -- ========================================================
    -- UPDATE LEAD
    -- ========================================================

    UPDATE public.leads
    SET
        status = v_new_status,
        assigned_user_id = v_new_assigned_user_id,
        updated_at = NOW()
    WHERE id = p_lead_id;

    -- ========================================================
    -- STATUS EVENT
    -- ========================================================

    IF v_new_status IS DISTINCT FROM v_old_status THEN

        INSERT INTO public.lead_events (
            lead_id,
            actor_id,
            action,
            metadata
        )
        VALUES (
            p_lead_id,
            v_actor_id,
            'status_changed',
            jsonb_build_object(
                'from', v_old_status,
                'to', v_new_status
            )
        );

    END IF;

    -- ========================================================
    -- ASSIGNMENT EVENT
    -- ========================================================

    IF v_new_assigned_user_id IS DISTINCT FROM v_old_assigned_user_id THEN

        INSERT INTO public.lead_events (
            lead_id,
            actor_id,
            action,
            metadata
        )
        VALUES (
            p_lead_id,
            v_actor_id,
            'assignment_changed',
            jsonb_build_object(
                'from', v_old_assigned_user_id,
                'to', v_new_assigned_user_id
            )
        );

    END IF;

    RETURN TRUE;

END;
$$;


REVOKE ALL
ON FUNCTION public.update_admin_lead(UUID, TEXT, UUID)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.update_admin_lead(UUID, TEXT, UUID)
TO authenticated;