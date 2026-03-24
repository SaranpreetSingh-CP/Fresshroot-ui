"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "@/services/order.service";
import type { OrderItemInput } from "@/utils/types";

/** Create an order (customer-side -- no customerId needed, backend uses auth) */
export function useCreateCustomerOrder() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ items, date }: { items: OrderItemInput[]; date?: string }) =>
			createOrder({ customerId: "", items, date }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["customerDashboard"] });
		},
	});
}
