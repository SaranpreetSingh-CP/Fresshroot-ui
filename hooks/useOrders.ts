"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "@/services/order.service";
import type { OrderItemInput } from "@/utils/types";

/** Create an order (customer-side) */
export function useCreateCustomerOrder(customerId: string = "1") {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ items, date }: { items: OrderItemInput[]; date?: string }) =>
			createOrder({ customerId: Number(customerId), items, date }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["customerDashboard"] });
			qc.invalidateQueries({ queryKey: ["customerUpcoming", customerId] });
			qc.invalidateQueries({ queryKey: ["planUsage", customerId] });
			qc.invalidateQueries({ queryKey: ["deliveredOrders", customerId] });
		},
	});
}
