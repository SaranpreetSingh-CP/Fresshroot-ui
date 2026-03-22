"use client";

import { useQuery } from "@tanstack/react-query";
import { getCustomerDashboard } from "@/services/dashboard.service";

/**
 * React Query hook for the customer dashboard.
 */
export function useCustomerDashboard(customerId: string) {
	return useQuery({
		queryKey: ["customerDashboard", customerId],
		queryFn: () => getCustomerDashboard(customerId),
		staleTime: 1000 * 60 * 5, // 5 minutes
		retry: 2,
	});
}
