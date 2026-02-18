/**
 * Service critique n°3 — Dette client
 * reste à payer = total commande - somme paiements
 */
import { requireWorkspace } from "./workspace.service";
import { customerDebtRepository } from "@/repositories/customer-debt.repository";
import { orderRepository, orderPaymentRepository } from "@/repositories/order.repository";
import type { CustomerWithDebt } from "@/types";

export async function listCustomersWithDebt(): Promise<CustomerWithDebt[]> {
  const { supabase, workspaceId } = await requireWorkspace();
  return customerDebtRepository.listWithDebt(supabase, workspaceId);
}

export async function getCustomerDebt(customerId: string): Promise<number> {
  const debts = await listCustomersWithDebt();
  const customer = debts.find((d) => d.id === customerId);
  return customer?.debt ?? 0;
}

/** Marquer toutes les commandes du client comme payées (ajoute les paiements manquants) */
export async function markCustomerPaid(customerId: string) {
  const { supabase, workspaceId } = await requireWorkspace();
  const orders = await orderRepository.listByWorkspace(supabase, workspaceId, { customerId });
  const today = new Date().toISOString().slice(0, 10);

  for (const order of orders) {
    const totalPaid = await orderPaymentRepository.getTotalPaid(supabase, order.id);
    const remaining = order.total_price - totalPaid;
    if (remaining > 0) {
      await orderPaymentRepository.create(supabase, {
        order_id: order.id,
        amount: remaining,
        paid_at: today,
        note: "Solde réglé",
        workspace_id: workspaceId,
      });
      await orderRepository.update(supabase, order.id, workspaceId, { payment_status: "paid" });
    }
  }
}
