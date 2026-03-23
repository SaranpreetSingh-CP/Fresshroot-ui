import type { CustomerFormData } from "@/utils/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

/** Build the API payload, mapping subscription fields to the expected shape */
function toPayload(data: CustomerFormData) {
	const { subscription, ...customer } = data;

	if (!subscription || !subscription.type) return customer;

	return {
		...customer,
		subscription: {
			type: subscription.type,
			package: subscription.package,
			actualPrice: Number(subscription.actualPrice),
			offerPrice: subscription.offerPrice
				? Number(subscription.offerPrice)
				: undefined,
			paymentTerms: subscription.paymentTerms || undefined,
			startDate: subscription.startDate,
			status: subscription.status,
		},
	};
}

/** POST /customers — Create a new customer */
export async function createCustomer(data: CustomerFormData) {
	const res = await fetch(`${API_BASE}/customers`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(toPayload(data)),
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
		body: JSON.stringify(toPayload(data as CustomerFormData)),
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

/** GET /customers/:id — Fetch a single customer with full details */
export async function getCustomerById(id: string) {
	const res = await fetch(`${API_BASE}/customers/${id}`);
	if (!res.ok)
		throw new Error(`Failed to fetch customer details (${res.status})`);
	return res.json();
}
