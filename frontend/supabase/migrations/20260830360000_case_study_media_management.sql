-- ============================================================
-- KODALIC WEBSITE
-- Migration: Case Study Media Management
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_admin_case_study_media_order(
    p_case_study_id UUID,
    p_media_id UUID,
    p_direction TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_order INTEGER;
    target_order INTEGER;
    target_media_id UUID;
BEGIN
    IF NOT public.has_permission('media.update') THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    SELECT "order"
    INTO current_order
    FROM public.case_study_media
    WHERE case_study_id = p_case_study_id
      AND media_id = p_media_id;

    IF current_order IS NULL THEN
        RAISE EXCEPTION 'Media is not attached to this Case Study';
    END IF;

    IF p_direction = 'up' THEN

        SELECT media_id, "order"
        INTO target_media_id, target_order
        FROM public.case_study_media
        WHERE case_study_id = p_case_study_id
          AND "order" < current_order
        ORDER BY "order" DESC
        LIMIT 1;

    ELSIF p_direction = 'down' THEN

        SELECT media_id, "order"
        INTO target_media_id, target_order
        FROM public.case_study_media
        WHERE case_study_id = p_case_study_id
          AND "order" > current_order
        ORDER BY "order" ASC
        LIMIT 1;

    ELSE
        RAISE EXCEPTION 'Invalid direction';
    END IF;

    IF target_media_id IS NULL THEN
        RETURN TRUE;
    END IF;

    UPDATE public.case_study_media
    SET "order" = -1
    WHERE case_study_id = p_case_study_id
      AND media_id = p_media_id;

    UPDATE public.case_study_media
    SET "order" = current_order
    WHERE case_study_id = p_case_study_id
      AND media_id = target_media_id;

    UPDATE public.case_study_media
    SET "order" = target_order
    WHERE case_study_id = p_case_study_id
      AND media_id = p_media_id;

    RETURN TRUE;
END;
$$;


CREATE OR REPLACE FUNCTION public.remove_admin_case_study_media(
    p_case_study_id UUID,
    p_media_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.has_permission('media.update') THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM public.case_study_media
        WHERE case_study_id = p_case_study_id
          AND media_id = p_media_id
    ) THEN
        RAISE EXCEPTION 'Media is not attached to this Case Study';
    END IF;

    DELETE FROM public.case_study_media
    WHERE case_study_id = p_case_study_id
      AND media_id = p_media_id;

    UPDATE public.case_studies
    SET hero_media_id = NULL
    WHERE id = p_case_study_id
      AND hero_media_id = p_media_id;

    RETURN TRUE;
END;
$$;


REVOKE ALL
ON FUNCTION public.update_admin_case_study_media_order(UUID, UUID, TEXT)
FROM PUBLIC;

REVOKE ALL
ON FUNCTION public.remove_admin_case_study_media(UUID, UUID)
FROM PUBLIC;


GRANT EXECUTE
ON FUNCTION public.update_admin_case_study_media_order(UUID, UUID, TEXT)
TO authenticated;

GRANT EXECUTE
ON FUNCTION public.remove_admin_case_study_media(UUID, UUID)
TO authenticated;