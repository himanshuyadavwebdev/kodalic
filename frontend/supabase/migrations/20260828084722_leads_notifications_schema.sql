-- ============================================================
-- KODALIC WEBSITE
-- Migration: Leads + Notifications
-- ============================================================


-- ============================================================
-- LEADS
-- ============================================================

CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    contact_fields JSONB NOT NULL DEFAULT '{}'::jsonb,

    service TEXT,
    budget TEXT,
    message TEXT NOT NULL,

    source TEXT,
    landing_page TEXT,
    utm JSONB NOT NULL DEFAULT '{}'::jsonb,

    status TEXT NOT NULL DEFAULT 'new',

    assigned_user_id UUID
        REFERENCES public.users(id)
        ON DELETE SET NULL,

    crm_external_id TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT leads_status_check
        CHECK (
            status IN (
                'new',
                'reviewed',
                'transferred_to_crm',
                'archived',
                'spam'
            )
        )
);

CREATE INDEX idx_leads_status
    ON public.leads(status);

CREATE INDEX idx_leads_assigned_user_id
    ON public.leads(assigned_user_id);

CREATE INDEX idx_leads_source
    ON public.leads(source);

CREATE INDEX idx_leads_created_at
    ON public.leads(created_at);

CREATE INDEX idx_leads_crm_external_id
    ON public.leads(crm_external_id);


-- ============================================================
-- LEAD NOTES
-- ============================================================

CREATE TABLE public.lead_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    lead_id UUID NOT NULL
        REFERENCES public.leads(id)
        ON DELETE CASCADE,

    author_id UUID
        REFERENCES public.users(id)
        ON DELETE SET NULL,

    note TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lead_notes_lead_id
    ON public.lead_notes(lead_id);

CREATE INDEX idx_lead_notes_author_id
    ON public.lead_notes(author_id);

CREATE INDEX idx_lead_notes_created_at
    ON public.lead_notes(created_at);


-- ============================================================
-- LEAD EVENTS
-- ============================================================

CREATE TABLE public.lead_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    lead_id UUID NOT NULL
        REFERENCES public.leads(id)
        ON DELETE CASCADE,

    actor_id UUID
        REFERENCES public.users(id)
        ON DELETE SET NULL,

    action TEXT NOT NULL,

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lead_events_lead_id
    ON public.lead_events(lead_id);

CREATE INDEX idx_lead_events_actor_id
    ON public.lead_events(actor_id);

CREATE INDEX idx_lead_events_created_at
    ON public.lead_events(created_at);


-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    type TEXT NOT NULL,
    recipient TEXT NOT NULL,

    lead_id UUID
        REFERENCES public.leads(id)
        ON DELETE SET NULL,

    status TEXT NOT NULL DEFAULT 'pending',

    provider_id TEXT,

    attempts INTEGER NOT NULL DEFAULT 0,

    last_error TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_status
    ON public.notifications(status);

CREATE INDEX idx_notifications_lead_id
    ON public.notifications(lead_id);

CREATE INDEX idx_notifications_created_at
    ON public.notifications(created_at);