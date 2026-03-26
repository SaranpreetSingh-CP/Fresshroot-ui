"use client";

import { useState, useMemo } from "react";
import {
	useCustomerDashboard,
	useDeliveredOrders,
	useCustomerUpcomingDeliveries,
	usePlanUsage,
	useSkipDelivery,
	useUpdateOrderItems,
} from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";
import { useCreateCustomerOrder } from "@/hooks/useOrders";
import { useCreateTicket, useTickets } from "@/hooks/useSupport";
import { useToast } from "@/components/Toast";
import NextDeliveryCard from "@/components/dashboard/NextDeliveryCard";
import UpcomingDeliveries from "@/components/dashboard/UpcomingDeliveries";
import DeliveredOrders from "@/components/dashboard/DeliveredOrders";
import CompactPlanUsage from "@/components/dashboard/CompactPlanUsage";
import CompactSubscription from "@/components/dashboard/CompactSubscription";
import SupportCard from "@/components/dashboard/SupportCard";
import OrderEditModal from "@/components/OrderEditModal";
import Modal from "@/components/Modal";
import CustomerOrderForm from "@/components/forms/CustomerOrderForm";
import SupportForm from "@/components/forms/SupportForm";
import SupportChat from "@/components/SupportChat";
import Badge from "@/components/Badge";
import Card, { CardHeader, CardTitle } from "@/components/Card";
import { DashboardSkeleton } from "@/components/Skeleton";
import type { OrderItemInput, CustomerUpcomingDelivery } from "@/utils/types";
import type {
	CreateTicketPayload,
	SupportTicket,
} from "@/services/support.service";

// TODO: Replace with real customer ID from auth context
const CUSTOMER_ID = "1";
const SUPPORT_PHONE = "+919876543210";

type ModalType = null | "createOrder" | "reportIssue";

const ticketStatusColor: Record<string, "green" | "blue" | "amber" | "gray"> = {
	open: "amber",
	"in-progress": "blue",
	resolved: "green",
	closed: "gray",
};

export default function CustomerDashboard() {
	const { data: user } = useAuth();
	const { data, isLoading, isError, error } = useCustomerDashboard(CUSTOMER_ID);
	const { data: deliveredOrders = [] } = useDeliveredOrders(CUSTOMER_ID);
	const { data: upcomingDeliveries = [] } =
		useCustomerUpcomingDeliveries(CUSTOMER_ID);
	const { data: planUsage } = usePlanUsage(CUSTOMER_ID);
	const { data: tickets } = useTickets();

	const createOrder = useCreateCustomerOrder(CUSTOMER_ID);
	const createTicket = useCreateTicket();
	const skipDelivery = useSkipDelivery(CUSTOMER_ID);
	const updateItems = useUpdateOrderItems(CUSTOMER_ID);
	const { toast } = useToast();

	const [openModal, setOpenModal] = useState<ModalType>(null);
	const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
	const [editingDelivery, setEditingDelivery] =
		useState<CustomerUpcomingDelivery | null>(null);

	function closeModal() {
		setOpenModal(null);
	}

	// Calculate total planned qty across upcoming deliveries (excluding the one being edited)
	const otherPlannedQty = useMemo(() => {
		return upcomingDeliveries
			.filter((d) => d.status !== "skipped" && d.id !== editingDelivery?.id)
			.reduce((sum, d) => sum + d.totalQty, 0);
	}, [upcomingDeliveries, editingDelivery]);

	/* -- Handlers ----------------------------------------------- */

	function handleCreateOrder(items: OrderItemInput[], date: string) {
		createOrder.mutate(
			{ items, date },
			{
				onSuccess: () => {
					toast("Order placed successfully!", "success");
					closeModal();
				},
				onError: (err) =>
					toast(
						err instanceof Error ? err.message : "Failed to place order",
						"error",
					),
			},
		);
	}

	function handleReportIssue(payload: CreateTicketPayload) {
		createTicket.mutate(payload, {
			onSuccess: () => {
				toast("Issue reported — we'll get back to you soon.", "success");
				closeModal();
			},
			onError: (err) =>
				toast(
					err instanceof Error ? err.message : "Failed to report issue",
					"error",
				),
		});
	}

	function handleSkip(delivery: CustomerUpcomingDelivery) {
		skipDelivery.mutate(delivery.orderId ?? delivery.id, {
			onSuccess: () => toast("Delivery skipped", "success"),
			onError: (err) =>
				toast(
					err instanceof Error ? err.message : "Failed to skip delivery",
					"error",
				),
		});
	}

	function handleSaveItems(
		orderId: string,
		items: { vegetableId: number; quantity: number; unit: string }[],
	) {
		updateItems.mutate(
			{ orderId, items },
			{
				onSuccess: () => {
					toast("Order items updated!", "success");
					setEditingDelivery(null);
				},
				onError: (err) =>
					toast(
						err instanceof Error ? err.message : "Failed to update items",
						"error",
					),
			},
		);
	}

	/* -- States ------------------------------------------------- */

	if (isLoading) return <DashboardSkeleton />;

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
				<span className="text-4xl">⚠️</span>
				<p className="text-lg font-medium text-gray-900">
					Something went wrong
				</p>
				<p className="text-sm text-gray-500">
					{error instanceof Error ? error.message : "Unable to load dashboard."}
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
					We couldn&apos;t find any dashboard data for your account.
				</p>
			</div>
		);
	}

	/* -- Derived data ------------------------------------------- */
	const nextDelivery = upcomingDeliveries[0] ?? null;
	const nextDateFormatted = nextDelivery
		? new Date(nextDelivery.date).toLocaleDateString("en-IN", {
				weekday: "short",
				day: "2-digit",
				month: "short",
			})
		: null;

	/* -- Chat view ---------------------------------------------- */
	if (activeTicketId) {
		return (
			<div className="space-y-4">
				<SupportChat
					ticketId={activeTicketId}
					onBack={() => setActiveTicketId(null)}
				/>
			</div>
		);
	}

	return (
		<>
			<div className="space-y-8">
				{/* ─── HEADER ──────────────────────────────────── */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Welcome back, {user?.name ?? "there"} 👋
						</h1>
						<p className="mt-1 text-gray-600">
							{nextDateFormatted
								? `Your next delivery is on ${nextDateFormatted}`
								: "Here\u2019s an overview of your plan and deliveries."}
						</p>
					</div>

					{/* Action buttons */}
					<div className="flex items-center gap-2 flex-shrink-0">
						<button
							onClick={() => setOpenModal("createOrder")}
							className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-green-700 transition"
						>
							🛒 Create Order
						</button>
						<button
							onClick={() => setOpenModal("reportIssue")}
							className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 transition"
						>
							🚨 Report Issue
						</button>
					</div>
				</div>

				{/* ─── TWO-COLUMN GRID ─────────────────────────── */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* ── LEFT: Main content (2/3) ────────────── */}
					<div className="lg:col-span-2 space-y-6">
						{/* Next Delivery */}
						<NextDeliveryCard
							delivery={nextDelivery}
							onEdit={(d) => setEditingDelivery(d)}
							onSkip={handleSkip}
							isSkipping={skipDelivery.isPending}
						/>

						{/* Upcoming Deliveries (skips first) */}
						<UpcomingDeliveries
							deliveries={upcomingDeliveries}
							onEdit={(d) => setEditingDelivery(d)}
							onSkip={handleSkip}
							isSkipping={skipDelivery.isPending}
						/>

						{/* Delivered Orders */}
						<DeliveredOrders orders={deliveredOrders} />
					</div>

					{/* ── RIGHT: Sidebar (1/3) ────────────────── */}
					<div className="space-y-6">
						{/* Plan Usage (compact) */}
						{planUsage && (
							<CompactPlanUsage
								usage={planUsage}
								plannedQty={upcomingDeliveries
									.filter((d) => d.status !== "skipped")
									.reduce((sum, d) => sum + d.totalQty, 0)}
							/>
						)}

						{/* Subscription (compact) */}
						{data.subscriptions && (
							<CompactSubscription subscriptions={data.subscriptions} />
						)}

						{/* Support */}
						<SupportCard
							phone={SUPPORT_PHONE}
							onReportIssue={() => setOpenModal("reportIssue")}
						/>

						{/* Support Tickets */}
						{tickets && tickets.length > 0 && (
							<div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
								<h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
									My Tickets
								</h3>
								<div className="space-y-1">
									{tickets.map((t: SupportTicket) => (
										<button
											key={t.id}
											onClick={() => setActiveTicketId(t.id)}
											className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left hover:bg-gray-50 transition"
										>
											<div className="min-w-0 flex-1">
												<p className="text-sm font-medium text-gray-900 capitalize truncate">
													{t.issueType.replace(/-/g, " ")}
												</p>
												<p className="text-[11px] text-gray-400">
													{new Date(t.createdAt).toLocaleDateString("en-GB", {
														day: "numeric",
														month: "short",
													})}
												</p>
											</div>
											<Badge variant={ticketStatusColor[t.status] ?? "gray"}>
												{t.status}
											</Badge>
										</button>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* -- Modals ------------------------------------------------ */}

			<Modal
				open={openModal === "createOrder"}
				onClose={closeModal}
				title="Create Order"
			>
				<CustomerOrderForm
					onSubmit={handleCreateOrder}
					isSubmitting={createOrder.isPending}
					planUsage={planUsage}
				/>
			</Modal>

			<Modal
				open={openModal === "reportIssue"}
				onClose={closeModal}
				title="Report an Issue"
			>
				<SupportForm
					deliveries={data.deliveries}
					onSubmit={handleReportIssue}
					isSubmitting={createTicket.isPending}
				/>
			</Modal>

			<OrderEditModal
				open={!!editingDelivery}
				onClose={() => setEditingDelivery(null)}
				delivery={editingDelivery}
				planUsage={planUsage ?? null}
				otherPlannedQty={otherPlannedQty}
				onSave={handleSaveItems}
				isSaving={updateItems.isPending}
			/>
		</>
	);
}
