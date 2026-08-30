-- ============================================================
-- KODALIC WEBSITE
-- SYNC SUPABASE AUTH USERS → PUBLIC USERS
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_name TEXT;
BEGIN
    user_name := COALESCE(
        NULLIF(TRIM(NEW.raw_user_meta_data ->> 'name'), ''),
        NULLIF(TRIM(NEW.raw_user_meta_data ->> 'full_name'), ''),
        split_part(NEW.email, '@', 1)
    );

    INSERT INTO public.users (
        id,
        email,
        name
    )
    VALUES (
        NEW.id,
        NEW.email,
        user_name
    )
    ON CONFLICT (id) DO UPDATE
    SET
        email = EXCLUDED.email,
        updated_at = now();

    RETURN NEW;
END;
$$;


DROP TRIGGER IF EXISTS on_auth_user_created
ON auth.users;


CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();