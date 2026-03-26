import type { CustomerFormData, CustomerPlanResponse } from "@/utils/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

/** Build the API payload, mapping subscription + plan fields to the expected shape */
function toPayload(data: CustomerFormData) {
	const { subscription, plan, ...customer } = data;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const payload: Record<string, any> = { ...customer };

	if (subscription && subscription.type) {
		payload.subscription = {
			type: subscription.type,
			package: subscription.package,
			actualPrice: Number(subscription.actualPrice),
			offerPrice: subscription.offerPrice
				? Number(subscription.offerPrice)
				: undefined,
			paymentTerms: subscription.paymentTerms || undefined,
			startDate: subscription.startDate,
			status: subscription.status,
		};
	}

	if (plan && plan.totalQty) {
		payload.plan = {
			totalQty: Number(plan.totalQty),
		};

		// Send vegetableLimits as a flat array in the API-expected shape
		const limits = (plan.limits ?? []).filter(
			(l) => l.vegetableId && (l.maxQtyKg || l.maxQtyPiece),
		);
		if (limits.length > 0) {
			payload.vegetableLimits = limits.map((l) => ({
				vegetableId: l.vegetableId,
				limitQty: l.unit === "kg" ? Number(l.maxQtyKg) : Number(l.maxQtyPiece),
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
