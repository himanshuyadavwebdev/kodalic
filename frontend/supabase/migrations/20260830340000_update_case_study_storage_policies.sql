-- ============================================================
-- KODALIC WEBSITE
-- Migration: Update Case Study Storage Policies
-- ============================================================

DROP POLICY IF EXISTS "case study media upload"
ON storage.objects;

DROP POLICY IF EXISTS "case study media view"
ON storage.objects;

DROP POLICY IF EXISTS "case study media update"
ON storage.objects;

DROP POLICY IF EXISTS "case study media delete"
ON storage.objects;


CREATE POLICY "case study media upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'case-study-media'
    AND public.storage_has_permission('media.create')
);


CREATE POLICY "case study media view"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'case-study-media'
    AND public.storage_has_permission('media.view')
);


CREATE POLICY "case study media update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'case-study-media'
    AND public.storage_has_permission('media.update')
)
WITH CHECK (
    bucket_id = 'case-study-media'
    AND public.storage_has_permission('media.update')
);


CREATE POLICY "case study media delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'case-study-media'
    AND public.storage_has_permission('media.delete')
);