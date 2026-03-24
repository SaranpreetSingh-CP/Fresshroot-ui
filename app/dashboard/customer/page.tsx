"use client";

import { useState } from "react";
import { useCustomerDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";
import { useCreateCustomerOrder } from "@/hooks/useOrders";
import { useCreateTicket, useTickets } from "@/hooks/useSupport";
import { useToast } from "@/components/Toast";
import SummaryCards from "@/components/SummaryCards";
import SubscriptionCard from "@/components/SubscriptionCard";
import DeliveryTable from "@/components/DeliveryTable";
import QuickActions from "@/components/QuickActions";
import Modal from "@/components/Modal";
import CustomerOrderForm from "@/components/forms/CustomerOrderForm";
import SupportForm from "@/components/forms/SupportForm";
import SupportChat from "@/components/SupportChat";
import Badge from "@/components/Badge";
import Card, { CardHeader, CardTitle } from "@/components/Card";
import { DashboardSkeleton } from "@/components/Skeleton";
import type { OrderItemInput } from "@/utils/types";
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
	const { data: tickets } = useTickets();
	const createOrder = useCreateCustomerOrder();
	const createTicket = useCreateTicket();
	const { toast } = useToast();

	const [openModal, setOpenModal] = useState<ModalType>(null);
	const [activeTicketId, setActiveTicketId] = useState<string | null>(null);

	function closeModal() {
		setOpenModal(null);
	}

	/* -- Handlers ----------------------------------------------- */

	function handleCreateOrder(items: OrderItemInput[]) {
		createOrder.mutate(items, {
			onSuccess: () => {
				toast("Order placed successfully!", "success");
				closeModal();
			},
			onError: (err) =>
				toast(
					err instanceof Error ? err.message : "Failed to place order",
					"error",
				),
		});
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
			<div className="space-y-10">
				{/* -- Header + Quick Actions --------------------------- */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Welcome back, {user?.name ?? "there"} 👋
						</h1>
						<p className="mt-1 text-gray-600">
							Here&apos;s an overview of your subscriptions and upcoming
							deliveries.
						</p>
					</div>
					<QuickActions phone={SUPPORT_PHONE} />
				</div>

				{/* -- Quick Stats ---------------------------------------- */}
				<SummaryCards
					activePlans={data.activePlans}
					upcomingDeliveries={data.upcomingDeliveries}
					itemsDelivered={data.itemsDelivered}
				/>

				{/* -- Action buttons ------------------------------------- */}
				<div className="flex flex-wrap gap-3">
					<button
						onClick={() => setOpenModal("createOrder")}
						className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-green-700 transition"
					>
						🛒 Create Order
					</button>
					<button
						onClick={() => setOpenModal("reportIssue")}
						className="rounded-lg border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-medium text-red-700 hover:bg-red-100 transition"
					>
						🚨 Report Issue
					</button>
				</div>

				{/* -- Subscriptions -------------------------------------- */}
				<section id="subscriptions">
					<h2 className="mb-4 text-xl font-bold text-gray-900">
						My Subscriptions
					</h2>
					{data.subscriptions.length === 0 ? (
						<p className="text-sm text-gray-500">
							You have no subscriptions yet.
						</p>
					) : (
						<div className="grid gap-4 sm:grid-cols-2">
							{data.subscriptions.map((sub) => (
								<SubscriptionCard
									key={`${sub.name}-${sub.startDate}`}
									subscription={sub}
								/>
							))}
						</div>
					)}
				</section>

				{/* -- Deliveries ----------------------------------------- */}
				<section id="deliveries">
					<h2 className="mb-4 text-xl font-bold text-gray-900">
						Delivery Status
					</h2>
					<DeliveryTable deliveries={data.deliveries} />
				</section>

				{/* -- Support Tickets ------------------------------------ */}
				{tickets && tickets.length > 0 && (
					<section id="support">
						<Card>
							<CardHeader>
								<CardTitle>My Support Tickets</CardTitle>
							</CardHeader>
							<div className="divide-y divide-gray-100">
								{tickets.map((t: SupportTicket) => (
									<button
										key={t.id}
										onClick={() => setActiveTicketId(t.id)}
										className="flex w-full items-center justify-between px-5 py-3 text-left hover:bg-gray-50 transition"
									>
										<div>
											<p className="text-sm font-medium text-gray-900 capitalize">
												{t.issueType.replace(/-/g, " ")}
											</p>
											<p className="text-xs text-gray-500">
												{new Date(t.createdAt).toLocaleDateString("en-GB", {
													day: "numeric",
													month: "short",
													year: "numeric",
												})}
											</p>
										</div>
										<Badge variant={ticketStatusColor[t.status] ?? "gray"}>
											{t.status}
										</Badge>
									</button>
								))}
							</div>
						</Card>
					</section>
				)}
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
		</>
	);
}
