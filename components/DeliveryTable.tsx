"use client";

import Card from "@/components/Card";
import Badge from "@/components/Badge";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import type { DashboardDelivery, DeliveryStatus } from "@/utils/types";
import { useUpdateDeliveryStatus } from "@/hooks/useAdminMutations";
import { useToast } from "@/components/Toast";

function formatDate(raw: string): string {
	const d = new Date(raw);
	return d.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

const deliveryColor: Record<
	string,
	"green" | "blue" | "amber" | "red" | "gray"
> = {
	delivered: "green",
	"in-transit": "blue",
	"out-for-delivery": "blue",
	scheduled: "amber",
	"not-started": "gray",
	cancelled: "red",
};

const STATUS_OPTIONS: { value: DeliveryStatus; label: string }[] = [
	{ value: "not-started", label: "Not Started" },
	{ value: "in-transit", label: "In Transit" },
	{ value: "out-for-delivery", label: "Out for Delivery" },
	{ value: "delivered", label: "Delivered" },
];

interface DeliveryTableProps {
	deliveries: DashboardDelivery[];
	/** Show editable status dropdown (admin view) */
	editable?: boolean;
}

export default function DeliveryTable({
	deliveries,
	editable = false,
}: DeliveryTableProps) {
	const updateStatus = useUpdateDeliveryStatus();
	const { toast } = useToast();

	function handleStatusChange(id: string, status: DeliveryStatus) {
		updateStatus.mutate(
			{ id, status },
			{
				onSuccess: () => toast("Delivery status updated", "success"),
				onError: (err) =>
					toast(
						err instanceof Error ? err.message : "Failed to update status",
						"error",
					),
			},
		);
	}

	const columns: Column<DashboardDelivery>[] = [
		{
			header: "Date",
			accessorKey: "date",
			cell: (row) => (
				<span className="text-gray-900">{formatDate(row.date)}</span>
			),
		},
		{
			header: "Items",
			accessorKey: "items",
			cell: (row) => (
				<span className="text-gray-600">
					{Array.isArray(row.items) ? row.items.join(", ") : row.items}
				</span>
			),
		},
		{
			header: "Status",
			accessorKey: "status",
			cell: (row) =>
				editable ? (
					<select
						className="rounded-lg border border-gray-300 px-2 py-1 text-xs font-medium focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
						value={row.status}
						onChange={(e) =>
							handleStatusChange(row.id, e.target.value as DeliveryStatus)
						}
					>
						{STATUS_OPTIONS.map((opt) => (
							<option key={opt.value} value={opt.value}>
								{opt.label}
							</option>
						))}
					</select>
				) : (
					<Badge variant={deliveryColor[row.status] ?? "gray"}>
						{row.status}
					</Badge>
				),
		},
	];

	return (
		<Card>
			<DataTable
				columns={columns}
				data={deliveries}
				keyExtractor={(d) => d.id ?? `${d.date}-${d.items}`}
				emptyMessage="No deliveries yet."
			/>
		</Card>
	);
}
