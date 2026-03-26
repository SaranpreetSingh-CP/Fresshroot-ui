import type { CustomerFormData, CustomerPlanResponse } from "@/utils/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

/**
 * Build the API payload from the flat CustomerFormData.
 * Omits subscription / plan / limits when the corresponding toggles are off.
 */
function toPayload(data: CustomerFormData) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const payload: Record<string, any> = {
		name: data.name,
		phone: data.phone,
		email: data.email,
		address: data.address,
		status: data.status,
	};

	if (data.hasSubscription && data.planType) {
		payload.subscription = {
			type: data.planType,
			package: data.packageName,
			actualPrice: Number(data.actualPrice),
			offerPrice: data.offerPrice ? Number(data.offerPrice) : undefined,
			paymentTerms: data.paymentTerms || undefined,
			startDate: data.startDate,
			status: data.subscriptionStatus,
		};
	}

	if (data.hasPlan && data.totalQtyKg) {
		payload.plan = {
			totalQty: Number(data.totalQtyKg),
		};

		const limits = (data.vegetableLimits ?? []).filter(
			(l) => l.vegetableId && l.maxQty !== "" && l.maxQty !== undefined,
		);
		if (limits.length > 0) {
			payload.vegetableLimits = limits.map((l) => ({
				vegetableId: l.vegetableId,
				limitQty: Number(l.maxQty),
				unit: l.unit,
			}));
		}
	}

	return payload;
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

/** GET /customers/:id/details — Fetch customer profile + subscriptions + past orders */
export async function getCustomerDetails(id: string) {
	const res = await fetch(`${API_BASE}/customers/${id}/details`);
	if (!res.ok)
		throw new Error(`Failed to fetch customer details (${res.status})`);
	return res.json();
}

/** GET /customers/:id/plan — Fetch customer plan with vegetable limits */
export async function getCustomerPlan(
	id: string,
): Promise<CustomerPlanResponse> {
	const res = await fetch(`${API_BASE}/customers/${id}/plan`);
	if (!res.ok) throw new Error(`Failed to fetch customer plan (${res.status})`);
	return res.json();
}
