"use client";

import Card, { CardHeader, CardTitle } from "@/components/Card";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import Badge from "@/components/Badge";
import { useUpcomingDeliveries } from "@/hooks/useAdminMutations";
import type { UpcomingDelivery } from "@/utils/types";
import type { OrderStatus } from "@/utils/types";

/* -- Helpers ------------------------------------------------------ */

function todayISO(): string {
	return new Date().toISOString().slice(0, 10);
}

function formatDate(raw: string): string {
	const d = new Date(raw);
	return d.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

function isToday(raw: string): boolean {
	return raw?.slice(0, 10) === todayISO();
}

/** Get the effective status - prefer computedStatus over status */
function effectiveStatus(row: UpcomingDelivery): string {
	return (row.computedStatus ?? row.status ?? "").toLowerCase();
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
		missed: "red",
	};

const statusOptions: { value: OrderStatus; label: string }[] = [
	{ value: "pending", label: "Pending" },
	{ value: "confirmed", label: "Confirmed" },
	{ value: "processing", label: "Processing" },
	{ value: "delivered", label: "Delivered" },
	{ value: "cancelled", label: "Cancelled" },
];

const statusSelectColor: Record<string, string> = {
	delivered: "bg-green-50 text-green-700 border-green-200",
	confirmed: "bg-blue-50 text-blue-700 border-blue-200",
	processing: "bg-blue-50 text-blue-700 border-blue-200",
	pending: "bg-amber-50 text-amber-700 border-amber-200",
	cancelled: "bg-red-50 text-red-700 border-red-200",
	missed: "bg-red-50 text-red-700 border-red-200",
};

/* -- Columns builder ---------------------------------------------- */

function buildColumns(
	onStatusChange?: (orderId: string, status: OrderStatus) => void,
	onEdit?: (row: UpcomingDelivery) => void,
	onDelete?: (orderId: string) => void,
	onMarkDelivered?: (orderId: string) => void,
): Column<UpcomingDelivery>[] {
	const cols: Column<UpcomingDelivery>[] = [
		{
			header: "Order",
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
						: "-"}
				</span>
			),
		},
		{
			header: "Date",
			accessorKey: "date",
			cell: (row) => (
				<span className="text-gray-600 flex items-center gap-1.5">
					{row.date ? formatDate(row.date) : "-"}
					{isToday(row.date) && (
						<Badge variant="green" className="text-[10px] px-1.5 py-0">
							Today
						</Badge>
					)}
				</span>
			),
		},
		{
			header: "Status",
			accessorKey: "status",
			cell: (row) => {
				const cs = effectiveStatus(row);
				const isMissed = cs === "missed";

				if (onStatusChange && !isMissed) {
					const colorCls =
						statusSelectColor[cs] ?? "bg-gray-50 text-gray-700 border-gray-200";
					return (
						<select
							value={cs}
							onChange={(e) =>
								onStatusChange(row.id, e.target.value as OrderStatus)
							}
							className={`rounded-full border px-2.5 py-0.5 text-xs font-medium cursor-pointer outline-none appearance-none pr-6 ${colorCls}`}
							style={{
								backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
								backgroundRepeat: "no-repeat",
								backgroundPosition: "right 6px center",
							}}
						>
							{statusOptions.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
					);
				}

				if (isMissed) {
					return (
						<div className="flex items-center gap-2">
							<Badge variant="red" className="ring-1 ring-red-300">
								Missed
							</Badge>
							{onMarkDelivered && (
								<button
									onClick={(e) => {
										e.stopPropagation();
										onMarkDelivered(row.id);
									}}
									className="text-[11px] font-medium text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-full px-2 py-0.5 transition whitespace-nowrap"
									title="Delivery was not marked earlier"
								>
									Mark Delivered
								</button>
							)}
						</div>
					);
				}

				const variant = statusBadge[cs] ?? "gray";
				return (
					<Badge variant={variant}>{row.computedStatus ?? row.status}</Badge>
				);
			},
		},
	];

	if (onEdit || onDelete) {
		cols.push({
			header: "Actions",
			accessorKey: "orderId" as keyof UpcomingDelivery,
			cell: (row) => (
				<div className="flex items-center gap-3">
					{onEdit && (
						<button
							onClick={(e) => {
								e.stopPropagation();
								onEdit(row);
							}}
							className="text-xs font-medium text-blue-600 hover:text-blue-800 transition"
						>
							Edit
						</button>
					)}
					{onDelete && (
						<button
							onClick={(e) => {
								e.stopPropagation();
								onDelete(row.id);
							}}
							className="text-xs font-medium text-red-600 hover:text-red-800 transition"
						>
							Delete
						</button>
					)}
				</div>
			),
		});
	}

	return cols;
}

/* -- Component ---------------------------------------------------- */

interface UpcomingDeliveriesTableProps {
	onAdd?: () => void;
	onStatusChange?: (orderId: string, status: OrderStatus) => void;
	onEdit?: (row: UpcomingDelivery) => void;
	onDelete?: (orderId: string) => void;
	onMarkDelivered?: (orderId: string) => void;
}

export default function UpcomingDeliveriesTable({
	onAdd,
	onStatusChange,
	onEdit,
	onDelete,
	onMarkDelivered,
}: UpcomingDeliveriesTableProps) {
	const { data, isLoading, isError } = useUpcomingDeliveries();

	// Sort ascending (nearest date first)
	const sorted = data
		? [...data].sort(
				(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
			)
		: [];

	const columns = buildColumns(
		onStatusChange,
		onEdit,
		onDelete,
		onMarkDelivered,
	);

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Upcoming Deliveries</CardTitle>
					{onAdd && (
						<button
							onClick={onAdd}
							className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 transition"
						>
							+ Create Order
						</button>
					)}
				</div>
			</CardHeader>

			{isLoading && (
				<div className="flex items-center justify-center py-8">
					<span className="text-sm text-gray-400">Loading deliveries...</span>
				</div>
			)}

			{isError && (
				<div className="flex items-center justify-center py-8">
					<span className="text-sm text-red-500">
						Failed to load deliveries.
					</span>
				</div>
			)}

			{!isLoading && !isError && (
				<DataTable
					columns={columns}
					data={sorted}
					keyExtractor={(d) => d.id}
					emptyMessage="No upcoming deliveries."
					className="max-h-96"
					rowClassName={(row) =>
						effectiveStatus(row) === "missed" ? "bg-red-50/50" : ""
					}
				/>
			)}
		</Card>
	);
}
