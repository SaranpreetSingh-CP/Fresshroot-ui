import Card, { CardHeader, CardTitle } from "@/components/Card";
import Badge from "@/components/Badge";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import type { AdminOrder } from "@/utils/types";

const statusColor = {
	pending: "amber" as const,
	processing: "blue" as const,
	delivered: "green" as const,
	cancelled: "red" as const,
};

function formatDate(raw: string): string {
	const d = new Date(raw);
	return d.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

const columns: Column<AdminOrder>[] = [
	{
		header: "Order",
		accessorKey: "id",
		cell: (row) => <span className="font-medium text-gray-900">{row.id}</span>,
	},
	{
		header: "Customer",
		accessorKey: "customerName",
		cell: (row) => <span className="text-gray-600">{row.customerName}</span>,
	},
	{
		header: "Items",
		accessorKey: "items",
		cell: (row) => (
			<span className="text-gray-600">{row.items.join(", ")}</span>
		),
	},
	{
		header: "Total",
		accessorKey: "total",
		cell: (row) => (
			<span className="text-gray-900">
				₹{row.total.toLocaleString("en-IN")}
			</span>
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
		header: "Status",
		accessorKey: "status",
		cell: (row) => (
			<Badge variant={statusColor[row.status]}>{row.status}</Badge>
		),
	},
];

interface OrdersTableProps {
	orders: AdminOrder[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Orders</CardTitle>
			</CardHeader>
			<DataTable
				columns={columns}
				data={orders}
				keyExtractor={(o) => o.id}
				emptyMessage="No orders yet."
			/>
		</Card>
	);
}
