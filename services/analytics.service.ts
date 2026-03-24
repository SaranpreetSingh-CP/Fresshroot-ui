import type {
	AnalyticsSummary,
	MissedDelivery,
	TrendDataPoint,
	TopVegetable,
} from "@/utils/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

/**
 * Fetch analytics KPI summary.
 * GET /analytics/summary
 */
export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
	const res = await fetch(`${API_BASE}/analytics/summary`);
	if (!res.ok)
		throw new Error(`Failed to fetch analytics summary (${res.status})`);
	return res.json();
}

/**
 * Fetch missed deliveries list.
 * GET /analytics/missed
 */
export async function getMissedDeliveries(): Promise<MissedDelivery[]> {
	const res = await fetch(`${API_BASE}/analytics/missed`);
	if (!res.ok)
		throw new Error(`Failed to fetch missed deliveries (${res.status})`);
	return res.json();
}

/**
 * Fetch order trend data.
 * GET /analytics/trend?days=N
 */
export async function getAnalyticsTrend(days = 7): Promise<TrendDataPoint[]> {
	const res = await fetch(`${API_BASE}/analytics/trend?days=${days}`);
	if (!res.ok)
		throw new Error(`Failed to fetch analytics trend (${res.status})`);
	return res.json();
}

/**
 * Fetch top vegetables by order count.
 * GET /analytics/top-vegetables
 */
export async function getTopVegetables(): Promise<TopVegetable[]> {
	const res = await fetch(`${API_BASE}/analytics/top-vegetables`);
	if (!res.ok)
		throw new Error(`Failed to fetch top vegetables (${res.status})`);
	return res.json();
}
