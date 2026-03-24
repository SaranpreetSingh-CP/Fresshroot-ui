"use client";

import { useState } from "react";
import Card, { CardHeader, CardTitle } from "@/components/Card";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import Badge from "@/components/Badge";
import { useOrdersByDate } from "@/hooks/useAdminMutations";
import type { OrderByDateItem } from "@/utils/types";

/* -- Helpers ------------------------------------------------------ */

function todayISO(): string {
	return new Date().toISOString().slice(0, 10);
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

const statusBadge: Record<string, "green" | "amber" | "blue" | "red" | "gray"> =
	{
		delivered: "green",
		"out-for-delivery": "blue",
		"in-transit": "amber",
		"not-started": "gray",
		pending: "amber",
		confirmed: "blue",
		processing: "blue",
		cancelled: "red",
	};

function formatCurrency(value: number): string {
	return `₹${value.toLocaleString("en-IN")}`;
}

/* -- Columns ------------------------------------------------------ */

const columns: Column<OrderByDateItem>[] = [
	{
		header: "Order ID",
		accessorKey: "id",
		cell: (row) => (
			<span className="font-mono text-xs font-medium text-gray-900">
				#{String(row.id).slice(0, 8)}
			</span>
		),
	},
	{
		header: "Customer",
		accessorKey: "customerName",
		cell: (row) => <span className="text-gray-700">{row.customerName}</span>,
	},
	{
		header: "Items",
		accessorKey: "items",
		cell: (row) => (
			<span className="text-gray-600 text-xs">
				{Array.isArray(row.items) && row.items.length
					? row.items
							.map((item) =>
								typeof item === "string"
									? item
									: (item as { name: string }).name,
							)
							.join(", ")
					: "—"}
			</span>
		),
	},
	{
		header: "Total",
		accessorKey: "total",
		cell: (row) => (
			<span className="font-medium text-gray-900">
				{row.total != null ? formatCurrency(row.total) : "—"}
			</span>
		),
	},
	{
		header: "Cost",
		accessorKey: "cost",
		cell: (row) => (
			<span className="text-gray-600">
				{row.cost != null ? formatCurrency(row.cost) : "NA"}
			</span>
		),
	},
	{
		header: "Status",
		accessorKey: "status",
		cell: (row) => {
			const variant = statusBadge[row.status?.toLowerCase()] ?? "gray";
			return <Badge variant={variant}>{row.status}</Badge>;
		},
	},
];

/* -- Component ---------------------------------------------------- */

export default function OrdersByDateSection() {
	const { data, isLoading, isError } = useOrdersByDate();
	const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

	function toggleDate(date: string) {
		setExpandedDates((prev) => {
			const next = new Set(prev);
			if (next.has(date)) {
				next.delete(date);
			} else {
				next.add(date);
			}
			return next;
		});
	}

	// Auto-expand the first date group on initial load
	if (data?.length && expandedDates.size === 0) {
		expandedDates.add(data[0].date);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>All Deliveries</CardTitle>
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
				<div className="max-h-[32rem] overflow-y-auto space-y-2">
					{data.length === 0 && (
						<p className="py-6 text-center text-sm text-gray-400">
							No orders found.
						</p>
					)}

					{data.map((group) => {
						const isExpanded = expandedDates.has(group.date);
						return (
							<div
								key={group.date}
								className="border border-gray-100 rounded-lg overflow-hidden"
							>
								<button
									type="button"
									onClick={() => toggleDate(group.date)}
									className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
								>
						<span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
									{formatDate(group.date)}
									{isToday(group.date) && (
										<Badge variant="green" className="text-[10px] px-1.5 py-0">
											Today
										</Badge>
									)}
									<span className="text-xs font-normal text-gray-400">
											({group.orders.length} order
											{group.orders.length !== 1 ? "s" : ""})
										</span>
									</span>
									<svg
										className={`h-4 w-4 text-gray-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
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

								{isExpanded && (
									<div className="px-2 pb-2">
										<DataTable
											columns={columns}
											data={group.orders}
											keyExtractor={(o) => o.id}
											emptyMessage="No orders for this date."
										/>
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
