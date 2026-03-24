"use client";

import { useState } from "react";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import {
	useCreateCustomer,
	useUpdateCustomer,
	useCreateOrder,
	useUpdateOrder,
	useUpdateOrderStatus,
	useDeleteOrder,
	useOrderDetail,
	useCreateExpense,
	useUpdateExpense,
	useExpensesList,
	useExpenseDetail,
	useCustomersList,
	useCustomerDetail,
	useMarkDelivered,
} from "@/hooks/useAdminMutations";
import { useToast } from "@/components/Toast";
import AdminSummaryCards from "@/components/AdminSummaryCards";
import CustomersTable from "@/components/CustomersTable";
import ExpenseTable from "@/components/ExpenseTable";
import UpcomingDeliveriesTable from "@/components/UpcomingDeliveriesTable";
import PricingForm from "@/components/PricingForm";
import OrdersByDateSection from "@/components/OrdersByDateSection";
import { DashboardSkeleton } from "@/components/Skeleton";
import Modal from "@/components/Modal";
import CustomerForm from "@/components/forms/CustomerForm";
import OrderForm from "@/components/forms/OrderForm";
import ExpenseForm from "@/components/forms/ExpenseForm";
import type {
	AdminCustomer,
	AdminOrder,
	AdminExpense,
	CustomerFormData,
	OrderFormData,
	OrderStatus,
	ExpenseFormData,
} from "@/utils/types";

type ModalType =
	| null
	| "addCustomer"
	| "editCustomer"
	| "addOrder"
	| "editOrder"
	| "addExpense"
	| "editExpense";

export default function AdminDashboard() {
	const { data, isLoading, isError, error } = useAdminDashboard();
	const { data: customersList } = useCustomersList();
	const createCustomer = useCreateCustomer();
	const updateCustomer = useUpdateCustomer();
	const createOrder = useCreateOrder();
	const updateOrder = useUpdateOrder();
	const updateOrderStatus = useUpdateOrderStatus();
	const deleteOrderMut = useDeleteOrder();
	const markDelivered = useMarkDelivered();
	const createExpense = useCreateExpense();
	const updateExpenseMut = useUpdateExpense();
	const { data: expensesList } = useExpensesList();
	const { toast } = useToast();

	const [openModal, setOpenModal] = useState<ModalType>(null);
	const [editTarget, setEditTarget] = useState<AdminCustomer | null>(null);
	const [editOrderTarget, setEditOrderTarget] = useState<AdminOrder | null>(
		null,
	);
	const [editExpenseTarget, setEditExpenseTarget] =
		useState<AdminExpense | null>(null);
	const [confirmDeliveredId, setConfirmDeliveredId] = useState<string | null>(
		null,
	);
	const { data: customerDetail, isLoading: isLoadingDetail } =
		useCustomerDetail(editTarget?.id ?? null);
	const { data: orderDetail, isLoading: isLoadingOrder } = useOrderDetail(
		editOrderTarget?.id ?? null,
	);
	const { data: expenseDetail, isLoading: isLoadingExpense } = useExpenseDetail(
		editExpenseTarget?.id ?? null,
	);

	function closeModal() {
		setOpenModal(null);
		setEditTarget(null);
		setEditOrderTarget(null);
		setEditExpenseTarget(null);
	}

	/* -- Handlers ----------------------------------------------- */

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

	function handleUpdateOrder(formData: OrderFormData, id?: string) {
		if (!id) return;
		updateOrder.mutate(
			{ id, data: formData },
			{
				onSuccess: () => {
					toast("Order updated successfully", "success");
					closeModal();
				},
				onError: (err) =>
					toast(
						err instanceof Error ? err.message : "Failed to update order",
						"error",
					),
			},
		);
	}

	function handleEditOrder(order: AdminOrder) {
		setEditOrderTarget(order);
		setOpenModal("editOrder");
	}

	function handleStatusChange(orderId: string, status: OrderStatus) {
		updateOrderStatus.mutate(
			{ id: orderId, status },
			{
				onSuccess: () => toast("Status updated", "success"),
				onError: (err) =>
					toast(
						err instanceof Error ? err.message : "Failed to update status",
						"error",
					),
			},
		);
	}

	function handleDeleteOrder(orderId: string) {
		deleteOrderMut.mutate(orderId, {
			onSuccess: () => toast("Order deleted", "success"),
			onError: (err) =>
				toast(
					err instanceof Error ? err.message : "Failed to delete order",
					"error",
				),
		});
	}

	function handleMarkDelivered(orderId: string) {
		setConfirmDeliveredId(orderId);
	}

	function confirmMarkDelivered() {
		if (!confirmDeliveredId) return;
		markDelivered.mutate(confirmDeliveredId, {
			onSuccess: () => {
				toast("Order marked as delivered", "success");
				setConfirmDeliveredId(null);
			},
			onError: (err) =>
				toast(
					err instanceof Error ? err.message : "Failed to mark delivered",
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

	function handleUpdateExpense(formData: ExpenseFormData) {
		if (!editExpenseTarget?.id) return;
		updateExpenseMut.mutate(
			{ id: editExpenseTarget.id, data: formData },
			{
				onSuccess: () => {
					toast("Expense updated successfully", "success");
					closeModal();
				},
				onError: (err) =>
					toast(
						err instanceof Error ? err.message : "Failed to update expense",
						"error",
					),
			},
		);
	}

	function handleEditExpense(expense: AdminExpense) {
		setEditExpenseTarget(expense);
		setOpenModal("editExpense");
	}

	function handleEditCustomer(customer: AdminCustomer) {
		setEditTarget(customer);
		setOpenModal("editCustomer");
	}

	/* -- Customer dropdown options for OrderForm ---------------- */
	const customerOptions = (customersList ?? data?.customers ?? []).map(
		(c: { id?: string; name: string }) => ({
			value: String(c.id ?? c.name),
			label: c.name,
		}),
	);

	/* -- Loading / Error states --------------------------------- */

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

				{/* -- Quick Stats ---------------------------------------- */}
				<AdminSummaryCards
					totalCustomers={data.summary.totalCustomers}
					activeCustomers={data.summary.activeCustomers}
					revenue={data.summary.revenue}
					expenses={data.summary.expenses}
				/>

				{/* -- Upcoming Deliveries -------------------------------- */}
				<section id="upcoming-deliveries">
					<UpcomingDeliveriesTable
						onAdd={() => setOpenModal("addOrder")}
						onStatusChange={handleStatusChange}
						onEdit={(row) =>
							handleEditOrder({
								id: row.id,
								customerId: 0,
								customerName: row.customerName,
								items: row.items as AdminOrder["items"],
								total: row.total,
								status: row.status as AdminOrder["status"],
								date: row.date,
							})
						}
						onDelete={handleDeleteOrder}
						onMarkDelivered={handleMarkDelivered}
					/>
				</section>

				{/* -- Set Vegetable Prices ------------------------------- */}
				<section id="pricing">
					<PricingForm />
				</section>

				{/* -- Customer List -------------------------------------- */}
				<section id="customers">
					<CustomersTable
						customers={data.customers}
						onAdd={() => setOpenModal("addCustomer")}
						onEdit={handleEditCustomer}
					/>
				</section>

				{/* -- Expense Tracker ------------------------------------ */}
				<section id="expenses">
					<ExpenseTable
						expenses={expensesList ?? data.expenses}
						totalExpenses={data.summary.expenses}
						onAdd={() => setOpenModal("addExpense")}
						onEdit={handleEditExpense}
					/>
				</section>

				{/* -- All Deliveries (Orders by Date) ------------------- */}
				<section id="all-deliveries">
					<OrdersByDateSection onMarkDelivered={handleMarkDelivered} />
				</section>
			</div>

			{/* -- Modals ------------------------------------------------ */}

			<Modal
				open={openModal === "addCustomer"}
				onClose={closeModal}
				title="Add Customer"
				className="max-w-2xl"
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
				className="max-w-2xl"
			>
				{editTarget && isLoadingDetail && (
					<div className="flex items-center justify-center py-12">
						<span className="text-sm text-gray-500">
							Loading customer details…
						</span>
					</div>
				)}
				{editTarget &&
					!isLoadingDetail &&
					(() => {
						const c = customerDetail ?? editTarget;
						// API returns subscriptions[] — pick the latest one
						const subs = c.subscriptions as AdminCustomer["subscriptions"];
						const sub = subs?.length ? subs[subs.length - 1] : null;
						return (
							<CustomerForm
								key={`${c.id}-${sub?.id ?? "no-sub"}`}
								initial={{
									id: String(c.id),
									name: c.name,
									phone: c.phone ?? "",
									email: c.email ?? "",
									address: c.address ?? "",
									...(sub
										? {
												subscription: {
													type: (sub.type as "STF" | "KG") ?? "",
													package: sub.package ?? "",
													actualPrice: sub.actualPrice ?? "",
													offerPrice: sub.offerPrice ?? "",
													paymentTerms: sub.paymentTerms ?? "",
													startDate: sub.startDate?.slice(0, 10) ?? "",
													status:
														(sub.status as "active" | "inactive") ?? "active",
												},
											}
										: {}),
								}}
								onSubmit={handleUpdateCustomer}
								isSubmitting={updateCustomer.isPending}
							/>
						);
					})()}
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
				open={openModal === "editOrder"}
				onClose={closeModal}
				title="Edit Order"
			>
				{editOrderTarget && isLoadingOrder && (
					<div className="flex items-center justify-center py-12">
						<span className="text-sm text-gray-500">
							Loading order details…
						</span>
					</div>
				)}
				{editOrderTarget &&
					!isLoadingOrder &&
					(() => {
						const o = orderDetail ?? editOrderTarget;
						const items = (o.items ?? []).map(
							(item: {
								name?: string;
								vegetableId?: number;
								quantity?: number;
								unit?: string;
							}) =>
								typeof item === "string"
									? {
											vegId: null,
											itemName: item,
											quantity: 1,
											unit: "kg" as const,
										}
									: {
											vegId: item.vegetableId ?? null,
											itemName: item.name ?? "",
											quantity: item.quantity ?? 1,
											unit: (item.unit as "kg" | "piece") ?? "kg",
										},
						);
						return (
							<OrderForm
								key={o.id}
								customers={customerOptions}
								initial={{
									id: o.id,
									customerId: String(o.customerId ?? ""),
									date: o.deliveryDate ?? o.date,
									status: o.status,
									itemRows: items,
									items: [],
								}}
								onSubmit={handleUpdateOrder}
								isSubmitting={updateOrder.isPending}
							/>
						);
					})()}
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

			<Modal
				open={openModal === "editExpense"}
				onClose={closeModal}
				title="Edit Expense"
			>
				{editExpenseTarget && isLoadingExpense && (
					<div className="flex items-center justify-center py-12">
						<span className="text-sm text-gray-500">
							Loading expense details…
						</span>
					</div>
				)}
				{editExpenseTarget && !isLoadingExpense && (
					<ExpenseForm
						key={editExpenseTarget.id}
						initial={expenseDetail ?? editExpenseTarget}
						onSubmit={handleUpdateExpense}
						isSubmitting={updateExpenseMut.isPending}
					/>
				)}
			</Modal>
			{/* -- Confirm Mark Delivered ----------------------------- */}
			<Modal
				open={confirmDeliveredId !== null}
				onClose={() => setConfirmDeliveredId(null)}
				title="Mark as Delivered"
				className="max-w-sm"
			>
				<p className="text-sm text-gray-600 mb-6">
					This order was missed. Are you sure you want to mark it as delivered?
				</p>
				<div className="flex items-center justify-end gap-3">
					<button
						onClick={() => setConfirmDeliveredId(null)}
						className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
					>
						Cancel
					</button>
					<button
						onClick={confirmMarkDelivered}
						disabled={markDelivered.isPending}
						className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition"
					>
						{markDelivered.isPending ? "Marking..." : "Yes, Mark Delivered"}
					</button>
				</div>
			</Modal>
		</>
	);
}
