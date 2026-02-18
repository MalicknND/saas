import { requireWorkspace } from "./workspace.service";
import { customerRepository } from "@/repositories/customer.repository";
import { listCustomersWithDebt as _listCustomersWithDebt } from "./debt.service";
import type { Customer } from "@/types/database";
import type { CustomerWithDebt } from "@/types";

export async function listCustomers(): Promise<Customer[]> {
  const { supabase, workspaceId } = await requireWorkspace();
  return customerRepository.listByWorkspace(supabase, workspaceId);
}

export async function getCustomer(id: string) {
  const { supabase, workspaceId } = await requireWorkspace();
  return customerRepository.getById(supabase, id, workspaceId);
}

export async function createCustomer(input: { name: string; phone?: string | null; notes?: string | null }) {
  const { supabase, workspaceId } = await requireWorkspace();
  return customerRepository.create(supabase, {
    workspace_id: workspaceId,
    name: input.name,
    phone: input.phone ?? null,
    notes: input.notes ?? null,
  });
}

export async function updateCustomer(id: string, input: { name?: string; phone?: string | null; notes?: string | null }) {
  const { supabase, workspaceId } = await requireWorkspace();
  return customerRepository.update(supabase, id, workspaceId, input);
}

export async function deleteCustomer(id: string) {
  const { supabase, workspaceId } = await requireWorkspace();
  return customerRepository.delete(supabase, id, workspaceId);
}

export async function listCustomersWithDebt(): Promise<CustomerWithDebt[]> {
  return _listCustomersWithDebt();
}
