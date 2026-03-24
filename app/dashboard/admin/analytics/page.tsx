"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useMarkDelivered } from "@/hooks/useAdminMutations";
import {
	useAnalyticsSummary,
	useMissedDeliveries,
	useAnalyticsTrend,
	useTopVegetables,
} from "@/hooks/useAnalytics";
import { useToast } from "@/components/Toast";
import StatCard from "@/components/StatCard";
import { TrendChart, TopVegetablesChart } from "@/components/AnalyticsChart";
import MissedTable from "@/components/MissedTable";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import { StatCardSkeleton, Skeleton } from "@/components/Skeleton";

export default function AnalyticsDashboard() {
	const { data: summary, isLoading: loadingSummary } = useAnalyticsSummary();
	const { data: missed, isLoading: loadingMissed } = useMissedDeliveries();
	const { data: trend, isLoading: loadingTrend } = useAnalyticsTrend(7);
	const { data: topVeg, isLoading: loadingTopVeg } = useTopVegetables();

	const markDelivered = useMarkDelivered();
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const [confirmDeliveredId, setConfirmDeliveredId] = useState<string | null>(
		null,
	);
	const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

	/* -- Handlers --------------------------------------------------- */

	function handleMarkDelivered(orderId: string) {
		setConfirmDeliveredId(orderId);
	}

	function confirmMark() {
		if (!confirmDeliveredId) return;
		markDelivered.mutate(confirmDeliveredId, {
			onSuccess: () => {
				toast("Order marked as delivered", "success");
				setConfirmDeliveredId(null);
				queryClient.invalidateQueries({ queryKey: ["missedDeliveries"] });
				queryClient.invalidateQueries({ queryKey: ["analyticsSummary"] });
			},
			onError: (err) =>
				toast(
					err instanceof Error ? err.message : "Failed to mark delivered",
					"error",
				),
		});
	}

	function handleRefresh() {
		queryClient.invalidateQueries({ queryKey: ["analyticsSummary"] });
		queryClient.invalidateQueries({ queryKey: ["missedDeliveries"] });
		queryClient.invalidateQueries({ queryKey: ["analyticsTrend"] });
		queryClient.invalidateQueries({ queryKey: ["topVegetables"] });
		setLastRefresh(new Date());
		toast("Dashboard refreshed", "success");
	}

	/* -- Render ----------------------------------------------------- */

	return (
		<>
			<div className="space-y-8">
				{/* -- Header -------------------------------------------- */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Analytics Dashboard
						</h1>
						<p className="text-sm text-gray-500 mt-0.5">
							Overview of orders, deliveries and trends.
						</p>
					</div>
					<div className="flex items-center gap-3">
						<span className="text-xs text-gray-400">
							Last refreshed:{" "}
							{lastRefresh.toLocaleTimeString("en-IN", {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</span>
						<button
							onClick={handleRefresh}
							className="rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
						>
							Refresh
						</button>
					</div>
				</div>

				{/* -- KPI Cards ----------------------------------------- */}
				<section>
					{loadingSummary ? (
						<div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
							{[1, 2, 3, 4].map((i) => (
								<StatCardSkeleton key={i} />
							))}
						</div>
					) : summary ? (
						<div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
							<StatCard
								title="Total Orders"
								value={summary.totalOrders}
								icon={<span>📦</span>}
								iconBg="bg-blue-50 text-blue-600"
							/>
							<StatCard
								title="Delivered"
								value={summary.delivered}
								icon={<span>✅</span>}
								iconBg="bg-green-50 text-green-600"
							/>
							<StatCard
								title="Missed"
								value={summary.missed}
								icon={<span>⚠️</span>}
								iconBg="bg-red-50 text-red-600"
								badge={
									summary.missed > 0 ? (
										<Badge variant="red" className="ring-1 ring-red-300">
											{summary.missed}
										</Badge>
									) : undefined
								}
							/>
							<StatCard
								title="Cancelled"
								value={summary.cancelled}
								icon={<span>❌</span>}
								iconBg="bg-gray-100 text-gray-600"
							/>
						</div>
					) : (
						<p className="text-sm text-gray-400">
							Unable to load summary data.
						</p>
					)}
				</section>

				{/* -- Trend Chart --------------------------------------- */}
				<section>
					<TrendChart data={trend ?? []} isLoading={loadingTrend} />
				</section>

				{/* -- Missed Deliveries Table --------------------------- */}
				<section>
					<MissedTable
						data={missed ?? []}
						isLoading={loadingMissed}
						onMarkDelivered={handleMarkDelivered}
					/>
				</section>

				{/* -- Top Vegetables ------------------------------------ */}
				<section>
					<TopVegetablesChart data={topVeg ?? []} isLoading={loadingTopVeg} />
				</section>
			</div>

			{/* -- Confirm Mark Delivered Modal ----------------------- */}
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
						onClick={confirmMark}
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
