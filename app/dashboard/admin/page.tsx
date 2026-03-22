"use client";

import { useState } from "react";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import {
	useCreateCustomer,
	useUpdateCustomer,
	useCreateOrder,
	useCreateExpense,
	useCustomersList,
} from "@/hooks/useAdminMutations";
import { useToast } from "@/components/Toast";
import AdminSummaryCards from "@/components/AdminSummaryCards";
import CustomersTable from "@/components/CustomersTable";
import OrdersTable from "@/components/OrdersTable";
import ExpenseTable from "@/components/ExpenseTable";
import { DashboardSkeleton } from "@/components/Skeleton";
import Modal from "@/components/Modal";
import CustomerForm from "@/components/forms/CustomerForm";
import OrderForm from "@/components/forms/OrderForm";
import ExpenseForm from "@/components/forms/ExpenseForm";
import type {
	AdminCustomer,
	CustomerFormData,
	OrderFormData,
	ExpenseFormData,
} from "@/utils/types";

type ModalType =
	| null
	| "addCustomer"
	| "editCustomer"
	| "addOrder"
	| "addExpense";

export default function AdminDashboard() {
	const { data, isLoading, isError, error } = useAdminDashboard();
	const { data: customersList } = useCustomersList();
	const createCustomer = useCreateCustomer();
	const updateCustomer = useUpdateCustomer();
	const createOrder = useCreateOrder();
	const createExpense = useCreateExpense();
	const { toast } = useToast();

	const [openModal, setOpenModal] = useState<ModalType>(null);
	const [editTarget, setEditTarget] = useState<AdminCustomer | null>(null);

	function closeModal() {
		setOpenModal(null);
		setEditTarget(null);
	}

	/* ── Handlers ─────────────────────────────────────────────── */

	function handleCreateCustomer(formData: CustomerFormData) {
		createCustomer.mutate(formData, {
			onSuccess: () => {
				toast("Customer added successfully", "success");
				closeModal();
			},
			onError: (err) =>
				toast(
					err instanceof Error ? err.message : "Failed to add customer",
					"error",
				),
		});
	}

	function handleUpdateCustomer(formData: CustomerFormData, id?: string) {
		if (!id) return;
		updateCustomer.mutate(
			{ id, data: formData },
			{
				onSuccess: () => {
					toast("Customer updated successfully", "success");
					closeModal();
				},
				onError: (err) =>
					toast(
						err instanceof Error ? err.message : "Failed to update customer",
						"error",
					),
			},
		);
	}

	function handleCreateOrder(formData: OrderFormData) {
		createOrder.mutate(formData, {
			onSuccess: () => {
				toast("Order created successfully", "success");
				closeModal();
			},
			onError: (err) =>
				toast(
					err instanceof Error ? err.message : "Failed to create order",
					"error",
				),
		});
	}

	function handleCreateExpense(formData: ExpenseFormData) {
		createExpense.mutate(formData, {
			onSuccess: () => {
				toast("Expense recorded successfully", "success");
				closeModal();
			},
			onError: (err) =>
				toast(
					err instanceof Error ? err.message : "Failed to record expense",
					"error",
				),
		});
	}

	function handleEditCustomer(customer: AdminCustomer) {
		setEditTarget(customer);
		setOpenModal("editCustomer");
	}

	/* ── Customer dropdown options for OrderForm ──────────────── */
	const customerOptions = (customersList ?? data?.customers ?? []).map(
		(c: { id?: string; name: string }) => ({
			value: c.id ?? c.name,
			label: c.name,
		}),
	);

	/* ── Loading / Error states ───────────────────────────────── */

	if (isLoading) return <DashboardSkeleton />;

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
				<span className="text-4xl">⚠️</span>
				<p className="text-lg font-medium text-gray-900">
					Something went wrong
				</p>
				<p className="text-sm text-gray-500">
					{error instanceof Error
						? error.message
						: "Unable to load admin dashboard."}
				</p>
			</div>
		);
	}

	if (!data) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
				<span className="text-4xl">📭</span>
				<p className="text-lg font-medium text-gray-900">No data available</p>
				<p className="text-sm text-gray-500">
					Admin dashboard data could not be loaded.
				</p>
			</div>
		);
	}

	return (
		<>
			<div className="space-y-10">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
					<p className="mt-1 text-gray-600">
						Manage customers, orders, and financials.
					</p>
				</div>

				{/* ── Quick Stats ──────────────────────────────────────── */}
				<AdminSummaryCards
					totalCustomers={data.summary.totalCustomers}
					activeCustomers={data.summary.activeCustomers}
					revenue={data.summary.revenue}
					expenses={data.summary.expenses}
				/>

				{/* ── Customer List ────────────────────────────────────── */}
				<section id="customers">
					<CustomersTable
						customers={data.customers}
						onAdd={() => setOpenModal("addCustomer")}
						onEdit={handleEditCustomer}
					/>
				</section>

				{/* ── Orders Table ─────────────────────────────────────── */}
				<section id="orders">
					<OrdersTable
						orders={data.orders}
						onAdd={() => setOpenModal("addOrder")}
					/>
				</section>

				{/* ── Expense Tracker ──────────────────────────────────── */}
				<section id="expenses">
					<ExpenseTable
						expenses={data.expenses}
						totalExpenses={data.summary.expenses}
						onAdd={() => setOpenModal("addExpense")}
					/>
				</section>
			</div>

			{/* ── Modals ──────────────────────────────────────────────── */}

			<Modal
				open={openModal === "addCustomer"}
				onClose={closeModal}
				title="Add Customer"
			>
				<CustomerForm
					onSubmit={handleCreateCustomer}
					isSubmitting={createCustomer.isPending}
				/>
			</Modal>

			<Modal
				open={openModal === "editCustomer"}
				onClose={closeModal}
				title="Edit Customer"
			>
				{editTarget && (
					<CustomerForm
						initial={{
							id: editTarget.id,
							name: editTarget.name,
							phone: editTarget.phone ?? "",
							email: editTarget.email ?? "",
							address: editTarget.address ?? "",
						}}
						onSubmit={handleUpdateCustomer}
						isSubmitting={updateCustomer.isPending}
					/>
				)}
			</Modal>

			<Modal
				open={openModal === "addOrder"}
				onClose={closeModal}
				title="Create Order"
			>
				<OrderForm
					customers={customerOptions}
					onSubmit={handleCreateOrder}
					isSubmitting={createOrder.isPending}
				/>
			</Modal>

			<Modal
				open={openModal === "addExpense"}
				onClose={closeModal}
				title="Record Expense"
			>
				<ExpenseForm
					onSubmit={handleCreateExpense}
					isSubmitting={createExpense.isPending}
				/>
			</Modal>
		</>
	);
}
