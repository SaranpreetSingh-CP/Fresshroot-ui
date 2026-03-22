"use client";

import { useCustomerDashboard } from "@/hooks/useDashboard";
import SummaryCards from "@/components/SummaryCards";
import SubscriptionCard from "@/components/SubscriptionCard";
import DeliveryTable from "@/components/DeliveryTable";
import { DashboardSkeleton } from "@/components/Skeleton";

// TODO: Replace with real customer ID from auth context
const CUSTOMER_ID = "1";

export default function CustomerDashboard() {
	const { data, isLoading, isError, error } = useCustomerDashboard(CUSTOMER_ID);

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

	return (
		<div className="space-y-10">
			<div>
				<h1 className="text-2xl font-bold text-gray-900">Welcome back! 👋</h1>
				<p className="mt-1 text-gray-600">
					Here&apos;s an overview of your subscriptions and upcoming deliveries.
				</p>
			</div>

			{/* ── Quick Stats ─────────────────────────────────────────── */}
			<SummaryCards
				activePlans={data.activePlans}
				upcomingDeliveries={data.upcomingDeliveries}
				itemsDelivered={data.itemsDelivered}
			/>

			{/* ── Subscriptions ───────────────────────────────────────── */}
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

			{/* ── Deliveries ──────────────────────────────────────────── */}
			<section id="deliveries">
				<h2 className="mb-4 text-xl font-bold text-gray-900">
					Delivery Status
				</h2>
				<DeliveryTable deliveries={data.deliveries} />
			</section>
		</div>
	);
}
