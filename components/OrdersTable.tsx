"use client";

import { useState } from "react";
import Card, { CardHeader, CardTitle } from "@/components/Card";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import type { AdminOrder, OrderStatus } from "@/utils/types";

/* -- Status config ------------------------------------------------ */

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
	{ value: "pending", label: "Pending" },
	{ value: "confirmed", label: "Confirmed" },
	{ value: "processing", label: "Processing" },
	{ value: "delivered", label: "Delivered" },
	{ value: "cancelled", label: "Cancelled" },
];

const statusColor: Record<OrderStatus, string> = {
	pending: "bg-amber-100 text-amber-800",
	confirmed: "bg-blue-100 text-blue-800",
	processing: "bg-purple-100 text-purple-800",
	delivered: "bg-green-100 text-green-800",
	cancelled: "bg-red-100 text-red-800",
};

/** Normalize status from API (may be uppercase) to our lowercase OrderStatus */
function normalizeStatus(raw: string): OrderStatus {
	const s = raw.toLowerCase() as OrderStatus;
	if (s in statusColor) return s;
	return "pending";
}

function formatDate(raw: string): string {
	const d = new Date(raw);
	return d.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

function getOrderItems(order: AdminOrder): string {
	if (!order.items?.length) return "—";
	const first = order.items[0];
	if (typeof first === "string") return order.items.join(", ");
	return (order.items as { name: string }[]).map((i) => i.name).join(", ");
}

function getCustomerName(order: AdminOrder): string {
	return order.customerName ?? order.customer?.name ?? "—";
}

function getOrderDate(order: AdminOrder): string {
	const raw = order.date ?? order.deliveryDate ?? order.createdAt;
	return raw ? formatDate(raw) : "—";
}

/* -- Props -------------------------------------------------------- */

interface OrdersTableProps {
	orders: AdminOrder[];
	onAdd?: () => void;
	onEdit?: (order: AdminOrder) => void;
	onDelete?: (orderId: string) => void;
	onStatusChange?: (orderId: string, status: OrderStatus) => void;
}

/* -- Component ---------------------------------------------------- */

export default function OrdersTable({
	orders,
	onAdd,
	onEdit,
	onDelete,
	onStatusChange,
}: OrdersTableProps) {
	const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

	const columns: Column<AdminOrder>[] = [
		{
			header: "Order",
			accessorKey: "id",
			cell: (row) => (
				<span className="font-medium text-gray-900 font-mono text-xs">
					#{String(row.id).slice(0, 8)}
				</span>
			),
		},
		{
			header: "Customer",
			accessorKey: "customerName",
			cell: (row) => (
				<span className="text-gray-600">{getCustomerName(row)}</span>
			),
		},
		{
			header: "Items",
			accessorKey: "items",
			cell: (row) => (
				<span className="text-gray-600 text-xs">{getOrderItems(row)}</span>
			),
		},
		{
			header: "Date",
			accessorKey: "date",
			cell: (row) => <span className="text-gray-600">{getOrderDate(row)}</span>,
		},
		{
			header: "Status",
			accessorKey: "status",
			cell: (row) => {
				const s = normalizeStatus(row.status);
				return onStatusChange ? (
					<select
						value={s}
						onChange={(e) =>
							onStatusChange(row.id, e.target.value as OrderStatus)
						}
						className={`rounded-full px-2.5 py-0.5 text-xs font-medium border-0 cursor-pointer focus:ring-2 focus:ring-green-200 ${statusColor[s]}`}
					>
						{STATUS_OPTIONS.map((opt) => (
							<option key={opt.value} value={opt.value}>
								{opt.label}
							</option>
						))}
					</select>
				) : (
					<span
						className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[s]}`}
					>
						{s}
					</span>
				);
			},
		},
		...(onEdit || onDelete
			? [
					{
						header: "Actions",
						accessorKey: "actions" as const,
						cell: (row: AdminOrder) => (
							<div className="flex items-center gap-1">
								{onEdit && (
									<button
										onClick={() => onEdit(row)}
										className="rounded-lg px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-50 transition"
									>
										Edit
									</button>
								)}
								{onDelete && (
									<>
										{confirmDeleteId === row.id ? (
											<div className="flex items-center gap-1">
												<button
													onClick={() => {
														onDelete(row.id);
														setConfirmDeleteId(null);
													}}
													className="rounded-lg px-2 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 transition"
												>
													Confirm
												</button>
												<button
													onClick={() => setConfirmDeleteId(null)}
													className="rounded-lg px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 transition"
												>
													Cancel
												</button>
											</div>
										) : (
											<button
												onClick={() => setConfirmDeleteId(row.id)}
												className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition"
											>
												Delete
											</button>
										)}
									</>
								)}
							</div>
						),
					},
				]
			: []),
	];

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
			<DataTable
				columns={columns}
				data={orders}
				keyExtractor={(o) => o.id}
				emptyMessage="No orders yet."
				className="max-h-96"
			/>
		</Card>
	);
}
