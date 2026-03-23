"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createCustomer,
	updateCustomer,
	getCustomers,
	getCustomerById,
} from "@/services/customer.service";
import {
	createOrder,
	updateOrder,
	updateOrderStatus,
	deleteOrder,
	getOrderById,
} from "@/services/order.service";
import {
	createExpense,
	updateExpense,
	getExpenses,
	getExpenseById,
} from "@/services/expense.service";
import { updateDeliveryStatus } from "@/services/delivery.service";
import type {
	CustomerFormData,
	OrderFormData,
	ExpenseFormData,
	DeliveryStatus,
	OrderStatus,
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
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
	});
}

/* ── Update Order ───────────────────────────────────────────────── */
export function useUpdateOrder() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<OrderFormData> }) =>
			updateOrder(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
	});
}

/* ── Update Order Status (inline) ───────────────────────────────── */
export function useUpdateOrderStatus() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
			updateOrderStatus(id, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
	});
}

/* ── Delete Order ───────────────────────────────────────────────── */
export function useDeleteOrder() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => deleteOrder(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
	});
}

/* ── Order Detail (for edit) ────────────────────────────────────── */
export function useOrderDetail(id: string | null) {
	return useQuery({
		queryKey: ["order", id],
		queryFn: () => getOrderById(id!),
		enabled: !!id,
		staleTime: 0,
	});
}

/* ── Expenses List (full objects with ids) ───────────────────────── */
export function useExpensesList() {
	return useQuery({
		queryKey: ["expenses"],
		queryFn: getExpenses,
		staleTime: 1000 * 60 * 2,
	});
}

/* ── Create Expense ─────────────────────────────────────────────── */
export function useCreateExpense() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: ExpenseFormData) => createExpense(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
			queryClient.invalidateQueries({ queryKey: ["expenses"] });
		},
	});
}

/* ── Update Expense ──────────────────────────────────────────────── */
export function useUpdateExpense() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: Partial<ExpenseFormData>;
		}) => updateExpense(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
			queryClient.invalidateQueries({ queryKey: ["expenses"] });
		},
	});
}

/* ── Expense Detail (for edit) ───────────────────────────────────── */
export function useExpenseDetail(id: string | null) {
	return useQuery({
		queryKey: ["expense", id],
		queryFn: () => getExpenseById(id!),
		enabled: !!id,
		staleTime: 0,
	});
}

/* ── Customer Detail (for edit) ──────────────────────────────────── */
export function useCustomerDetail(id: string | null) {
	return useQuery({
		queryKey: ["customer", id],
		queryFn: () => getCustomerById(id!),
		enabled: !!id,
		staleTime: 0,
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
