-- =============================================================================
-- Devise par workspace — chaque vendeur choisit sa devise
-- =============================================================================

ALTER TABLE workspaces
  ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT '€';

COMMENT ON COLUMN workspaces.currency IS 'Symbole ou code devise (DH, €, $, XOF, etc.)';
