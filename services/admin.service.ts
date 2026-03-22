import type { AdminDashboardResponse } from "@/utils/types";

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
