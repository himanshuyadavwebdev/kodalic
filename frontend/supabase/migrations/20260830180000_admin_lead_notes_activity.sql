-- ============================================================
-- KODALIC WEBSITE
-- Migration: Admin Lead Notes + Activity
-- ============================================================


-- ============================================================
-- GET LEAD NOTES
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_admin_lead_notes(
    p_lead_id UUID
)
RETURNS TABLE (
    id UUID,
    lead_id UUID,
    author_id UUID,
    author_name TEXT,
    note TEXT,
    created_at TIMESTAMPTZ
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
        n.id,
        n.lead_id,
        n.author_id,
        COALESCE(u.name, 'Unknown'),
        n.note,
        n.created_at
    FROM public.lead_notes n
    LEFT JOIN public.users u
        ON u.id = n.author_id
    WHERE n.lead_id = p_lead_id
    ORDER BY n.created_at DESC;

END;
$$;


REVOKE ALL
ON FUNCTION public.get_admin_lead_notes(UUID)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.get_admin_lead_notes(UUID)
TO authenticated;


-- ============================================================
-- GET LEAD ACTIVITY
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_admin_lead_activity(
    p_lead_id UUID
)
RETURNS TABLE (
    id UUID,
    lead_id UUID,
    actor_id UUID,
    actor_name TEXT,
    action TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ
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
        e.id,
        e.lead_id,
        e.actor_id,
        COALESCE(u.name, 'System'),
        e.action,
        e.metadata,
        e.created_at
    FROM public.lead_events e
    LEFT JOIN public.users u
        ON u.id = e.actor_id
    WHERE e.lead_id = p_lead_id
    ORDER BY e.created_at DESC;

END;
$$;


REVOKE ALL
ON FUNCTION public.get_admin_lead_activity(UUID)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.get_admin_lead_activity(UUID)
TO authenticated;


-- ============================================================
-- ADD LEAD NOTE
-- ============================================================

CREATE OR REPLACE FUNCTION public.add_admin_lead_note(
    p_lead_id UUID,
    p_note TEXT
)
RETURNS UUID
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_actor_id UUID;
    v_note_id UUID;
    v_note TEXT;
BEGIN

    v_actor_id := auth.uid();

    IF v_actor_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;

    IF NOT public.has_permission('leads.update') THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    v_note := trim(p_note);

    IF v_note = '' THEN
        RAISE EXCEPTION 'Note cannot be empty';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM public.leads
        WHERE id = p_lead_id
    ) THEN
        RAISE EXCEPTION 'Lead not found';
    END IF;

    INSERT INTO public.lead_notes (
        lead_id,
        author_id,
        note
    )
    VALUES (
        p_lead_id,
        v_actor_id,
        v_note
    )
    RETURNING id INTO v_note_id;

    INSERT INTO public.lead_events (
        lead_id,
        actor_id,
        action,
        metadata
    )
    VALUES (
        p_lead_id,
        v_actor_id,
        'note_added',
        jsonb_build_object(
            'note_id', v_note_id
        )
    );

    RETURN v_note_id;

END;
$$;


REVOKE ALL
ON FUNCTION public.add_admin_lead_note(UUID, TEXT)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.add_admin_lead_note(UUID, TEXT)
TO authenticated;