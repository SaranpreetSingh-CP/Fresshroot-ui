import type {
	CustomerDashboardResponse,
	CustomerDeliveredOrder,
	CustomerUpcomingDelivery,
	PlanUsage,
} from "@/utils/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

/**
 * Fetch customer dashboard data.
 * GET /dashboard/customer/:id
 */
export async function getCustomerDashboard(
	customerId: string,
): Promise<CustomerDashboardResponse> {
	const res = await fetch(`${API_BASE}/dashboard/customer/${customerId}`);

	if (!res.ok) {
		throw new Error(`Failed to fetch dashboard (${res.status})`);
	}

	return res.json();
}

/**
 * Fetch delivered orders for a customer.
 * GET /customers/:id/delivered-orders
 */
export async function getDeliveredOrders(
	customerId: string,
): Promise<CustomerDeliveredOrder[]> {
	const res = await fetch(
		`${API_BASE}/customers/${customerId}/delivered-orders`,
	);
	if (!res.ok)
		throw new Error(`Failed to fetch delivered orders (${res.status})`);
	return res.json();
}

/**
 * Fetch upcoming deliveries for a customer.
 * GET /customers/:id/upcoming-deliveries
 */
export async function getCustomerUpcomingDeliveries(
	customerId: string,
): Promise<CustomerUpcomingDelivery[]> {
	const res = await fetch(
		`${API_BASE}/customers/${customerId}/upcoming-deliveries`,
	);
	if (!res.ok)
		throw new Error(`Failed to fetch upcoming deliveries (${res.status})`);
	return res.json();
}

/**
 * Fetch plan usage summary for a customer.
 * GET /customers/:id/plan-usage
 */
export async function getPlanUsage(customerId: string): Promise<PlanUsage> {
	const res = await fetch(`${API_BASE}/customers/${customerId}/plan-usage`);
	if (!res.ok) throw new Error(`Failed to fetch plan usage (${res.status})`);
	return res.json();
}

/**
 * Skip a delivery.
 * PATCH /orders/:id/skip
 */
export async function skipDelivery(
	orderId: string,
): Promise<{ success: boolean }> {
	const res = await fetch(`${API_BASE}/orders/${orderId}/skip`, {
		method: "PATCH",
	});
	if (!res.ok) throw new Error(`Failed to skip delivery (${res.status})`);
	return res.json();
}

/**
 * Update order items.
 * PATCH /orders/:id/items
 */
export async function updateOrderItems(
	orderId: string,
	items: { vegetableId: number; quantity: number; unit: string }[],
): Promise<{ success: boolean }> {
	const res = await fetch(`${API_BASE}/orders/${orderId}/items`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ items }),
	});
	if (!res.ok) throw new Error(`Failed to update order items (${res.status})`);
	return res.json();
}
