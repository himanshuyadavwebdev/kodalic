-- ============================================================
-- KODALIC WEBSITE
-- Migration: Audit Logs + Content Versions
-- ============================================================


-- ============================================================
-- AUDIT LOGS
-- ============================================================

CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    actor_id UUID
        REFERENCES public.users(id)
        ON DELETE SET NULL,

    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id UUID NOT NULL,

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_actor_id
    ON public.audit_logs(actor_id);

CREATE INDEX idx_audit_logs_entity
    ON public.audit_logs(entity, entity_id);

CREATE INDEX idx_audit_logs_action
    ON public.audit_logs(action);

CREATE INDEX idx_audit_logs_created_at
    ON public.audit_logs(created_at);


-- ============================================================
-- CONTENT VERSIONS
-- ============================================================

CREATE TABLE public.content_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,

    version_number INTEGER NOT NULL,

    snapshot JSONB NOT NULL,

    created_by UUID
        REFERENCES public.users(id)
        ON DELETE SET NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT content_versions_entity_version_unique
        UNIQUE (entity_type, entity_id, version_number)
);

CREATE INDEX idx_content_versions_entity
    ON public.content_versions(entity_type, entity_id);

CREATE INDEX idx_content_versions_created_by
    ON public.content_versions(created_by);

CREATE INDEX idx_content_versions_created_at
    ON public.content_versions(created_at);