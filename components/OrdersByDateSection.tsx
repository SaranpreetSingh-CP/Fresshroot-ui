"use client";

import { useState } from "react";
import Card, { CardHeader, CardTitle } from "@/components/Card";
import Badge from "@/components/Badge";
import { useOrdersByDate } from "@/hooks/useAdminMutations";
import type { OrderByDateItem } from "@/utils/types";

/* -- Helpers ------------------------------------------------------ */

function todayISO(): string {
	return new Date().toISOString().slice(0, 10);
}

function yesterdayISO(): string {
	const d = new Date();
	d.setDate(d.getDate() - 1);
	return d.toISOString().slice(0, 10);
}

function formatDate(raw: string): string {
	const d = new Date(raw);
	return d.toLocaleDateString("en-GB", {
		weekday: "long",
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

function isToday(raw: string): boolean {
	return raw?.slice(0, 10) === todayISO();
}

function isYesterday(raw: string): boolean {
	return raw?.slice(0, 10) === yesterdayISO();
}

function effectiveStatus(row: OrderByDateItem): string {
	return (row.computedStatus ?? row.status ?? "").toLowerCase();
}

const statusConfig: Record<
	string,
	{ variant: "green" | "amber" | "blue" | "red" | "gray"; icon: string }
> = {
	delivered: { variant: "green", icon: "✔" },
	"out-for-delivery": { variant: "blue", icon: "🚚" },
	"in-transit": { variant: "amber", icon: "📦" },
	"not-started": { variant: "gray", icon: "⏳" },
	pending: { variant: "amber", icon: "⏳" },
	confirmed: { variant: "blue", icon: "✓" },
	processing: { variant: "blue", icon: "⚙" },
	cancelled: { variant: "red", icon: "✕" },
	missed: { variant: "red", icon: "✕" },
};

function formatCurrency(value: number): string {
	return `₹${value.toLocaleString("en-IN")}`;
}

function formatItems(items: OrderByDateItem["items"]): string {
	if (!items) return "—";
	if (typeof items === "string") return items || "—";
	if (!Array.isArray(items) || items.length === 0) return "—";
	return items
		.map((item) =>
			typeof item === "string" ? item : (item as { name: string }).name,
		)
		.join(", ");
}

/** Capitalize first letter, lowercase rest */
function capitalize(s: string): string {
	if (!s) return s;
	return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

/* -- Order Row ---------------------------------------------------- */

function OrderRow({
	order,
	onMarkDelivered,
}: {
	order: OrderByDateItem;
	onMarkDelivered?: (orderId: string) => void;
}) {
	const cs = effectiveStatus(order);
	const isMissed = cs === "missed";
	const cfg = statusConfig[cs] ?? { variant: "gray" as const, icon: "•" };

	return (
		<div
			className={`group flex items-center justify-between gap-3 rounded-lg px-3 py-3.5 transition-colors hover:bg-gray-50/80 ${
				isMissed
					? "border-l-[3px] border-l-red-400 bg-red-50/30"
					: "border-l-[3px] border-l-transparent"
			}`}
		>
			{/* Left: customer + items */}
			<div className="min-w-0 flex-1">
				<p className="truncate text-sm font-medium text-gray-900">
					{order.customerName}
				</p>
				<p className="mt-0.5 truncate text-xs text-gray-400">
					{formatItems(order.items)}
				</p>
			</div>

			{/* Right: total + status + action */}
			<div className="flex items-center gap-3 shrink-0">
				{/* Total */}
				<span className="hidden sm:inline text-sm font-semibold text-gray-800 tabular-nums">
					{order.total != null ? formatCurrency(order.total) : "—"}
				</span>

				{/* Status badge with icon */}
				<Badge variant={cfg.variant}>
					<span className="mr-0.5">{cfg.icon}</span>{" "}
					{capitalize(order.computedStatus ?? order.status)}
				</Badge>

				{/* Mark Delivered — only for missed */}
				{isMissed && onMarkDelivered && (
					<button
						onClick={(e) => {
							e.stopPropagation();
							onMarkDelivered(order.id);
						}}
						className="rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700 transition hover:bg-green-100 whitespace-nowrap"
					>
						Mark Delivered
					</button>
				)}
			</div>
		</div>
	);
}

/* -- Component ---------------------------------------------------- */

interface OrdersByDateSectionProps {
	onMarkDelivered?: (orderId: string) => void;
}

export default function OrdersByDateSection({
	onMarkDelivered,
}: OrdersByDateSectionProps) {
	const { data, isLoading, isError } = useOrdersByDate();
	const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
	const [initialized, setInitialized] = useState(false);
	const [searchDate, setSearchDate] = useState("");

	function toggleDate(date: string) {
		setExpandedDates((prev) => {
			const next = new Set(prev);
			if (next.has(date)) next.delete(date);
			else next.add(date);
			return next;
		});
	}

	// Auto-expand today + yesterday on first load
	if (data?.length && !initialized) {
		const seed = new Set<string>();
		for (const g of data) {
			if (isToday(g.date) || isYesterday(g.date)) seed.add(g.date);
		}
		// If neither today nor yesterday exist, expand the first group
		if (seed.size === 0 && data.length > 0) seed.add(data[0].date);
		setExpandedDates(seed);
		setInitialized(true);
	}

	const allExpanded = data
		? data.every((g) => expandedDates.has(g.date))
		: false;

	// Filter groups by search date
	const filteredData = data
		? searchDate
			? data.filter((g) => g.date?.slice(0, 10) === searchDate)
			: data
		: [];

	function toggleAll() {
		if (!data) return;
		setExpandedDates(
			allExpanded ? new Set() : new Set(data.map((g) => g.date)),
		);
	}

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between flex-wrap gap-3">
					<div className="flex items-center gap-2">
						<span className="text-lg">📦</span>
						<CardTitle>All Deliveries</CardTitle>
					</div>
					<div className="flex items-center gap-3">
						<input
							type="date"
							value={searchDate}
							onChange={(e) => {
								const val = e.target.value;
								setSearchDate(val);
								// Auto-expand the matched date
								if (val) setExpandedDates((prev) => new Set(prev).add(val));
							}}
							className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
						/>
						{searchDate && (
							<button
								type="button"
								onClick={() => setSearchDate("")}
								className="text-xs font-medium text-gray-400 hover:text-gray-600 transition"
							>
								Clear
							</button>
						)}
						{data && data.length > 1 && !searchDate && (
							<button
								type="button"
								onClick={toggleAll}
								className="text-xs font-medium text-green-700 hover:text-green-800 transition"
							>
								{allExpanded ? "Collapse All" : "Expand All"}
							</button>
						)}
					</div>
				</div>
			</CardHeader>

			{isLoading && (
				<div className="flex items-center justify-center py-8">
					<span className="text-sm text-gray-400">Loading orders…</span>
				</div>
			)}

			{isError && (
				<div className="flex items-center justify-center py-8">
					<span className="text-sm text-red-500">Failed to load orders.</span>
				</div>
			)}

			{!isLoading && !isError && data && (
				<div className="space-y-3 px-5 pb-5">
					{filteredData.length === 0 && (
						<p className="py-6 text-center text-sm text-gray-400">
							{searchDate
								? "No deliveries found for this date."
								: "No orders found."}
						</p>
					)}

					{filteredData.map((group) => {
						const isExpanded = expandedDates.has(group.date);
						const missedCount = group.orders.filter(
							(o) => effectiveStatus(o) === "missed",
						).length;

						return (
							<div
								key={group.date}
								className="rounded-xl border border-gray-100 bg-white overflow-hidden"
							>
								{/* Date header */}
								<button
									type="button"
									onClick={() => toggleDate(group.date)}
									className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50/60 transition-colors"
								>
									<div className="flex items-center gap-2 min-w-0">
										<span className="text-sm font-semibold text-gray-800">
											{formatDate(group.date)}
										</span>

										{isToday(group.date) && (
											<Badge
												variant="green"
												className="text-[10px] px-1.5 py-0"
											>
												Today
											</Badge>
										)}

										{isYesterday(group.date) && (
											<Badge variant="blue" className="text-[10px] px-1.5 py-0">
												Yesterday
											</Badge>
										)}

										<span className="text-xs text-gray-400">
											{group.orders.length} delivery
											{group.orders.length !== 1 ? "ies" : "y"}
										</span>

										{missedCount > 0 && (
											<span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700">
												{missedCount} missed
											</span>
										)}
									</div>

									<svg
										className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>

								{/* Order list */}
								{isExpanded && (
									<div className="border-t border-gray-100 space-y-4 px-4 py-2">
										{group.orders.length === 0 && (
											<p className="py-6 text-center text-sm text-gray-400">
												No orders for this date.
											</p>
										)}
										{group.orders.map((order) => (
											<OrderRow
												key={order.id}
												order={order}
												onMarkDelivered={onMarkDelivered}
											/>
										))}
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
		</Card>
	);
}
