import type { CustomerDashboardResponse } from "@/utils/types";

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
