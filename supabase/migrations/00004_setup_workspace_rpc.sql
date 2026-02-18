-- =============================================================================
-- RPC pour créer workspace au setup (contourne les problèmes RLS/grants)
-- S'exécute en SECURITY DEFINER avec vérification auth.uid()
-- =============================================================================

CREATE OR REPLACE FUNCTION public.create_workspace_on_setup(workspace_name TEXT)
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

  -- Récupérer email et nom depuis auth.users
  SELECT email, COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', '')
  INTO user_email, user_full_name
  FROM auth.users
  WHERE id = user_id;

  -- Créer le profil si inexistant
  INSERT INTO public.profiles (id, email, full_name, avatar_url, created_at, updated_at)
  VALUES (user_id, COALESCE(user_email, ''), user_full_name, NULL, now(), now())
  ON CONFLICT (id) DO NOTHING;

  -- Créer le workspace
  INSERT INTO public.workspaces (name, owner_id, created_at, updated_at)
  VALUES (trim(workspace_name), user_id, now(), now())
  RETURNING id INTO new_workspace_id;

  RETURN new_workspace_id;
END;
$$;

-- Permettre à authenticated d'appeler cette fonction
GRANT EXECUTE ON FUNCTION public.create_workspace_on_setup(TEXT) TO authenticated;
