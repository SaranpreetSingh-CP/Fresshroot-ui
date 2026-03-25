"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getCustomerDashboard,
	getDeliveredOrders,
	getCustomerUpcomingDeliveries,
	getPlanUsage,
	skipDelivery,
	updateOrderItems,
} from "@/services/dashboard.service";

/**
 * React Query hook for the customer dashboard.
 */
export function useCustomerDashboard(customerId: string) {
	return useQuery({
		queryKey: ["customerDashboard", customerId],
		queryFn: () => getCustomerDashboard(customerId),
		staleTime: 1000 * 60 * 5,
		retry: 2,
	});
}

/** Fetch delivered orders for a customer */
export function useDeliveredOrders(customerId: string) {
	return useQuery({
		queryKey: ["deliveredOrders", customerId],
		queryFn: () => getDeliveredOrders(customerId),
		staleTime: 1000 * 60 * 2,
	});
}

/** Fetch upcoming deliveries for a customer */
export function useCustomerUpcomingDeliveries(customerId: string) {
	return useQuery({
		queryKey: ["customerUpcoming", customerId],
		queryFn: () => getCustomerUpcomingDeliveries(customerId),
		staleTime: 1000 * 60 * 2,
	});
}

/** Fetch plan usage summary */
export function usePlanUsage(customerId: string) {
	return useQuery({
		queryKey: ["planUsage", customerId],
		queryFn: () => getPlanUsage(customerId),
		staleTime: 1000 * 60 * 2,
	});
}

/** Skip a delivery */
export function useSkipDelivery(customerId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (orderId: string) => skipDelivery(orderId),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["customerUpcoming", customerId] });
			qc.invalidateQueries({ queryKey: ["planUsage", customerId] });
			qc.invalidateQueries({ queryKey: ["customerDashboard", customerId] });
		},
	});
}

/** Update order items */
export function useUpdateOrderItems(customerId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({
			orderId,
			items,
		}: {
			orderId: string;
			items: { vegetableId: number; quantity: number; unit: string }[];
		}) => updateOrderItems(orderId, items),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["customerUpcoming", customerId] });
			qc.invalidateQueries({ queryKey: ["planUsage", customerId] });
			qc.invalidateQueries({ queryKey: ["customerDashboard", customerId] });
		},
	});
}
