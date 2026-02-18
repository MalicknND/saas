-- =============================================================================
-- RPC create_workspace_on_setup : ajout du paramètre currency
-- =============================================================================

DROP FUNCTION IF EXISTS public.create_workspace_on_setup(TEXT);

CREATE OR REPLACE FUNCTION public.create_workspace_on_setup(
  workspace_name TEXT,
  workspace_currency TEXT DEFAULT '€'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id UUID;
  user_email TEXT;
  user_full_name TEXT;
  new_workspace_id UUID;
BEGIN
  user_id := auth.uid();
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Non authentifié';
  END IF;

  SELECT email, COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', '')
  INTO user_email, user_full_name
  FROM auth.users
  WHERE id = user_id;

  INSERT INTO public.profiles (id, email, full_name, avatar_url, created_at, updated_at)
  VALUES (user_id, COALESCE(user_email, ''), user_full_name, NULL, now(), now())
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.workspaces (name, owner_id, currency, created_at, updated_at)
  VALUES (trim(workspace_name), user_id, COALESCE(NULLIF(trim(workspace_currency), ''), '€'), now(), now())
  RETURNING id INTO new_workspace_id;

  RETURN new_workspace_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_workspace_on_setup(TEXT, TEXT) TO authenticated;
