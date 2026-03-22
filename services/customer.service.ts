import type { CustomerFormData } from "@/utils/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

/** POST /customers — Create a new customer */
export async function createCustomer(data: CustomerFormData) {
	const res = await fetch(`${API_BASE}/customers`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error(`Failed to create customer (${res.status})`);
	return res.json();
}

/** PATCH /customers/:id — Update an existing customer */
export async function updateCustomer(
	id: string,
	data: Partial<CustomerFormData>,
) {
	const res = await fetch(`${API_BASE}/customers/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error(`Failed to update customer (${res.status})`);
	return res.json();
}

/** GET /customers — List all customers (for dropdowns etc.) */
export async function getCustomers() {
	const res = await fetch(`${API_BASE}/customers`);
	if (!res.ok) throw new Error(`Failed to fetch customers (${res.status})`);
	return res.json();
}
