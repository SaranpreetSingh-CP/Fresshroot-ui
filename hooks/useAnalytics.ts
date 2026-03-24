"use client";

import { useQuery } from "@tanstack/react-query";
import {
	getAnalyticsSummary,
	getMissedDeliveries,
	getAnalyticsTrend,
	getTopVegetables,
} from "@/services/analytics.service";

const REFETCH_INTERVAL = 30 * 1000; // 30 seconds

/**
 * KPI summary: total orders, delivered, missed, cancelled.
 */
export function useAnalyticsSummary() {
	return useQuery({
		queryKey: ["analyticsSummary"],
		queryFn: getAnalyticsSummary,
		staleTime: 1000 * 60,
		refetchInterval: REFETCH_INTERVAL,
	});
}

/**
 * Missed deliveries list for the missed-deliveries table.
 */
export function useMissedDeliveries() {
	return useQuery({
		queryKey: ["missedDeliveries"],
		queryFn: getMissedDeliveries,
		staleTime: 1000 * 60,
		refetchInterval: REFETCH_INTERVAL,
	});
}

/**
 * Order trend over the last N days.
 */
export function useAnalyticsTrend(days = 7) {
	return useQuery({
		queryKey: ["analyticsTrend", days],
		queryFn: () => getAnalyticsTrend(days),
		staleTime: 1000 * 60,
		refetchInterval: REFETCH_INTERVAL,
	});
}

/**
 * Top vegetables by order frequency.
 */
export function useTopVegetables() {
	return useQuery({
		queryKey: ["topVegetables"],
		queryFn: getTopVegetables,
		staleTime: 1000 * 60,
		refetchInterval: REFETCH_INTERVAL,
	});
}
