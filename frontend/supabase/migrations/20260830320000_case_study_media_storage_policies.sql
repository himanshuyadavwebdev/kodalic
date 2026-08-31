-- ============================================================
-- KODALIC WEBSITE
-- Migration: Case Study Media Storage Policies
-- ============================================================

CREATE POLICY "case study media upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'case-study-media'
    AND public.has_permission('media.create')
);

CREATE POLICY "case study media view"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'case-study-media'
    AND public.has_permission('media.view')
);

CREATE POLICY "case study media update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'case-study-media'
    AND public.has_permission('media.update')
)
WITH CHECK (
    bucket_id = 'case-study-media'
    AND public.has_permission('media.update')
);

CREATE POLICY "case study media delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'case-study-media'
    AND public.has_permission('media.delete')
);