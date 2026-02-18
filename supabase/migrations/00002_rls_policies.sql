-- =============================================================================
-- Row Level Security (RLS)
-- All policies filter by workspace_id. Users only access workspaces they belong to.
-- =============================================================================

-- Helper: get current user's workspace ids (owner or member)
CREATE OR REPLACE FUNCTION get_user_workspace_ids()
RETURNS SETOF UUID AS $$
BEGIN
  RETURN QUERY
  SELECT w.id FROM workspaces w
  WHERE w.owner_id = auth.uid()
  UNION
  SELECT wm.workspace_id FROM workspace_members wm
  WHERE wm.user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- ENABLE RLS ON ALL TABLES
-- -----------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- PROFILES: users can read/update own profile
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (id = auth.uid());

-- -----------------------------------------------------------------------------
-- WORKSPACES: access if owner or member
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can view own workspaces"
  ON workspaces FOR SELECT USING (id IN (SELECT get_user_workspace_ids()));

CREATE POLICY "Users can create workspace"
  ON workspaces FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update workspace"
  ON workspaces FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Owners can delete workspace"
  ON workspaces FOR DELETE USING (owner_id = auth.uid());

-- -----------------------------------------------------------------------------
-- WORKSPACE_MEMBERS
-- -----------------------------------------------------------------------------
CREATE POLICY "Members can view workspace members"
  ON workspace_members FOR SELECT USING (workspace_id IN (SELECT get_user_workspace_ids()));

CREATE POLICY "Owners can manage members"
  ON workspace_members FOR ALL USING (
    workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid())
  );

-- -----------------------------------------------------------------------------
-- CUSTOMERS: workspace-scoped
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can manage customers in their workspaces"
  ON customers FOR ALL USING (workspace_id IN (SELECT get_user_workspace_ids()));

CREATE POLICY "Users can insert customers in their workspaces"
  ON customers FOR INSERT WITH CHECK (workspace_id IN (SELECT get_user_workspace_ids()));

-- -----------------------------------------------------------------------------
-- ORDERS: workspace-scoped
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can manage orders in their workspaces"
  ON orders FOR ALL USING (workspace_id IN (SELECT get_user_workspace_ids()));

CREATE POLICY "Users can insert orders in their workspaces"
  ON orders FOR INSERT WITH CHECK (workspace_id IN (SELECT get_user_workspace_ids()));

-- -----------------------------------------------------------------------------
-- ORDER_PAYMENTS: workspace-scoped
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can manage payments in their workspaces"
  ON order_payments FOR ALL USING (workspace_id IN (SELECT get_user_workspace_ids()));

CREATE POLICY "Users can insert payments in their workspaces"
  ON order_payments FOR INSERT WITH CHECK (workspace_id IN (SELECT get_user_workspace_ids()));

-- -----------------------------------------------------------------------------
-- EXPENSES: workspace-scoped
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can manage expenses in their workspaces"
  ON expenses FOR ALL USING (workspace_id IN (SELECT get_user_workspace_ids()));

CREATE POLICY "Users can insert expenses in their workspaces"
  ON expenses FOR INSERT WITH CHECK (workspace_id IN (SELECT get_user_workspace_ids()));
