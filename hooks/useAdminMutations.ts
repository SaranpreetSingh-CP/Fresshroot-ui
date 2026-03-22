"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createCustomer,
	updateCustomer,
	getCustomers,
} from "@/services/customer.service";
import { createOrder } from "@/services/order.service";
import { createExpense } from "@/services/expense.service";
import { updateDeliveryStatus } from "@/services/delivery.service";
import type {
	CustomerFormData,
	OrderFormData,
	ExpenseFormData,
	DeliveryStatus,
} from "@/utils/types";

/* ── Customers List (for dropdowns) ─────────────────────────────── */
export function useCustomersList() {
	return useQuery({
		queryKey: ["customers"],
		queryFn: getCustomers,
		staleTime: 1000 * 60 * 5,
	});
}

/* ── Create Customer ────────────────────────────────────────────── */
export function useCreateCustomer() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CustomerFormData) => createCustomer(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
			queryClient.invalidateQueries({ queryKey: ["customers"] });
		},
	});
}

/* ── Update Customer ────────────────────────────────────────────── */
export function useUpdateCustomer() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: Partial<CustomerFormData>;
		}) => updateCustomer(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
			queryClient.invalidateQueries({ queryKey: ["customers"] });
		},
	});
}

/* ── Create Order ───────────────────────────────────────────────── */
export function useCreateOrder() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: OrderFormData) => createOrder(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
		},
	});
}

/* ── Create Expense ─────────────────────────────────────────────── */
export function useCreateExpense() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: ExpenseFormData) => createExpense(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
		},
	});
}

/* ── Update Delivery Status ─────────────────────────────────────── */
export function useUpdateDeliveryStatus() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, status }: { id: string; status: DeliveryStatus }) =>
			updateDeliveryStatus(id, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
			queryClient.invalidateQueries({ queryKey: ["customerDashboard"] });
		},
	});
}
