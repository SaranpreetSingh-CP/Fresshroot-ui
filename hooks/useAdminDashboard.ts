"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "@/services/admin.service";

/**
 * React Query hook for the admin dashboard.
 */
export function useAdminDashboard() {
	return useQuery({
		queryKey: ["adminDashboard"],
		queryFn: getAdminDashboard,
		staleTime: 1000 * 60 * 5,
		retry: 2,
	});
}
