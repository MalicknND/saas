-- =============================================================================
-- RPC get_dashboard_today — une seule requête pour Today (summary + orders + debts)
-- Réduit la latence : 4 round-trips → 1
-- =============================================================================

CREATE OR REPLACE FUNCTION public.get_dashboard_today(
  p_workspace_id UUID,
  p_date DATE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER  -- s'exécute avec le JWT de l'utilisateur, RLS s'applique
SET search_path = public
AS $$
DECLARE
  v_income NUMERIC := 0;
  v_expenses NUMERIC := 0;
  v_orders JSONB;
  v_debt_total NUMERIC := 0;
  v_debt_count INT := 0;
  v_workspace_ok BOOLEAN;
BEGIN
  -- Vérifier accès au workspace
  SELECT EXISTS (
    SELECT 1 FROM workspaces w WHERE w.id = p_workspace_id AND w.owner_id = auth.uid()
    UNION
    SELECT 1 FROM workspace_members wm WHERE wm.workspace_id = p_workspace_id AND wm.user_id = auth.uid()
  ) INTO v_workspace_ok;

  IF NOT v_workspace_ok THEN
    RAISE EXCEPTION 'Accès refusé à ce workspace';
  END IF;

  -- Income du jour (paiements reçus)
  SELECT COALESCE(SUM(op.amount), 0) INTO v_income
  FROM order_payments op
  WHERE op.workspace_id = p_workspace_id
    AND op.paid_at = p_date;

  -- Dépenses du jour
  SELECT COALESCE(SUM(e.amount), 0) INTO v_expenses
  FROM expenses e
  WHERE e.workspace_id = p_workspace_id
    AND e.date = p_date;

  -- Commandes du jour avec infos client
  SELECT COALESCE(
    (
      SELECT jsonb_agg(r ORDER BY r->>'delivery_date' DESC)
      FROM (
        SELECT jsonb_build_object(
          'id', o.id,
          'items', o.items,
          'total_price', o.total_price,
          'delivery_date', o.delivery_date,
          'status', o.status,
          'payment_status', o.payment_status,
          'customer_id', o.customer_id,
          'customer', CASE WHEN c.id IS NOT NULL THEN jsonb_build_object('id', c.id, 'name', c.name) ELSE NULL END
        ) AS r
        FROM orders o
        LEFT JOIN customers c ON c.id = o.customer_id AND c.workspace_id = o.workspace_id
        WHERE o.workspace_id = p_workspace_id
          AND o.delivery_date = p_date
      ) sub
    ),
    '[]'::jsonb
  ) INTO v_orders;

  -- Debts : total et count (clients avec reste à payer > 0)
  WITH customer_debts AS (
    SELECT
      c.id,
      (COALESCE(SUM(o.total_price), 0) - COALESCE((
        SELECT SUM(op.amount) FROM order_payments op
        INNER JOIN orders o2 ON o2.id = op.order_id AND o2.customer_id = c.id AND o2.workspace_id = p_workspace_id
        WHERE op.workspace_id = p_workspace_id
      ), 0)) AS debt
    FROM customers c
    LEFT JOIN orders o ON o.customer_id = c.id AND o.workspace_id = p_workspace_id
    WHERE c.workspace_id = p_workspace_id
    GROUP BY c.id
  )
  SELECT
    COALESCE(SUM(GREATEST(debt, 0)), 0),
    COUNT(*) FILTER (WHERE debt > 0)
  INTO v_debt_total, v_debt_count
  FROM customer_debts;

  RETURN jsonb_build_object(
    'summary', jsonb_build_object(
      'income', v_income,
      'expenses', v_expenses,
      'profit', v_income - v_expenses
    ),
    'orders', COALESCE(v_orders, '[]'::jsonb),
    'debts', jsonb_build_object(
      'total', v_debt_total,
      'count', v_debt_count
    )
  );
END;
$$;

-- Permettre à authenticated d'appeler
GRANT EXECUTE ON FUNCTION public.get_dashboard_today(UUID, DATE) TO authenticated;
