"use client";

import Card, { CardHeader, CardTitle } from "@/components/Card";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import Badge from "@/components/Badge";
import { Skeleton, TableSkeleton } from "@/components/Skeleton";
import type { MissedDelivery } from "@/utils/types";

/* -- Helpers ------------------------------------------------------ */

function formatDate(raw: string): string {
	const d = new Date(raw);
	return d.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

/* -- Columns ------------------------------------------------------ */

function buildColumns(
	onMarkDelivered?: (orderId: string) => void,
): Column<MissedDelivery>[] {
	return [
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
			cell: (row) => (
				<span className="text-gray-700 font-medium">{row.customerName}</span>
			),
		},
		{
			header: "Date",
			accessorKey: "date",
			cell: (row) => (
				<span className="text-gray-600">{formatDate(row.date)}</span>
			),
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
			header: "Action",
			accessorKey: "action" as keyof MissedDelivery,
			cell: (row) =>
				onMarkDelivered ? (
					<button
						onClick={(e) => {
							e.stopPropagation();
							onMarkDelivered(row.id);
						}}
						className="text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-full px-3 py-1 transition whitespace-nowrap"
					>
						Mark Delivered
					</button>
				) : null,
		},
	];
}

/* -- Component ---------------------------------------------------- */

interface MissedTableProps {
	data: MissedDelivery[];
	isLoading?: boolean;
	onMarkDelivered?: (orderId: string) => void;
	onRowClick?: (row: MissedDelivery) => void;
}

export default function MissedTable({
	data,
	isLoading,
	onMarkDelivered,
	onRowClick,
}: MissedTableProps) {
	const columns = buildColumns(onMarkDelivered);

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center gap-2">
					<CardTitle>Missed Deliveries</CardTitle>
					{data.length > 0 && (
						<Badge variant="red" className="ring-1 ring-red-300">
							{data.length}
						</Badge>
					)}
				</div>
			</CardHeader>

			{isLoading ? (
				<div className="space-y-3">
					<Skeleton className="h-4 w-1/4" />
					<TableSkeleton columns={5} rows={4} />
				</div>
			) : (
				<DataTable
					columns={columns}
					data={data}
					keyExtractor={(d) => d.id}
					emptyMessage="No missed deliveries - great job!"
					className="max-h-96"
					rowClassName={() => "bg-red-50/50"}
					onRowClick={onRowClick}
				/>
			)}
		</Card>
	);
}
