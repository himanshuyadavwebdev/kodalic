-- ============================================================
-- KODALIC WEBSITE
-- Migration: Media RLS Policies
-- ============================================================

CREATE POLICY "media create"
ON public.media
FOR INSERT
TO authenticated
WITH CHECK (
    public.storage_has_permission('media.create')
);

CREATE POLICY "media view"
ON public.media
FOR SELECT
TO authenticated
USING (
    public.storage_has_permission('media.view')
);

CREATE POLICY "media update"
ON public.media
FOR UPDATE
TO authenticated
USING (
    public.storage_has_permission('media.update')
)
WITH CHECK (
    public.storage_has_permission('media.update')
);

CREATE POLICY "media delete"
ON public.media
FOR DELETE
TO authenticated
USING (
    public.storage_has_permission('media.delete')
);