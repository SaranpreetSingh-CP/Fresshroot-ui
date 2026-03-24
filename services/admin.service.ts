import type {
	AdminDashboardResponse,
	UpcomingDelivery,
	SetPricesPayload,
	OrdersByDateGroup,
	VegetablePrice,
} from "@/utils/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

/**
 * Fetch admin dashboard data.
 * GET /admin/dashboard
 */
export async function getAdminDashboard(): Promise<AdminDashboardResponse> {
	const res = await fetch(`${API_BASE}/admin/dashboard`);

	if (!res.ok) {
		throw new Error(`Failed to fetch admin dashboard (${res.status})`);
	}

	return res.json();
}

/**
 * Fetch upcoming deliveries.
 * GET /admin/upcoming-deliveries
 */
export async function getUpcomingDeliveries(): Promise<UpcomingDelivery[]> {
	const res = await fetch(`${API_BASE}/admin/upcoming-deliveries`);
	if (!res.ok)
		throw new Error(`Failed to fetch upcoming deliveries (${res.status})`);
	return res.json();
}

/**
 * Fetch vegetable list with current prices for a given date.
 * GET /vegetable-prices?date=YYYY-MM-DD
 */
export async function getVegetablePrices(
	date: string,
): Promise<VegetablePrice[]> {
	const res = await fetch(`${API_BASE}/vegetable-prices?date=${date}`);
	if (!res.ok)
		throw new Error(`Failed to fetch vegetable prices (${res.status})`);
	return res.json();
}

/**
 * Save vegetable prices.
 * POST /vegetable-prices
 */
export async function setVegetablePrices(
	payload: SetPricesPayload,
): Promise<{ success: boolean }> {
	const res = await fetch(`${API_BASE}/vegetable-prices`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	if (!res.ok)
		throw new Error(`Failed to save vegetable prices (${res.status})`);
	return res.json();
}

/**
 * Fetch orders grouped by date.
 * GET /admin/orders-by-date
 */
export async function getOrdersByDate(): Promise<OrdersByDateGroup[]> {
	const res = await fetch(`${API_BASE}/admin/orders-by-date`);
	if (!res.ok)
		throw new Error(`Failed to fetch orders by date (${res.status})`);
	return res.json();
}
