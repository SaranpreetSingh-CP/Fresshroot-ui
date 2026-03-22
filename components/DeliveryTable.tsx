import Card from "@/components/Card";
import Badge from "@/components/Badge";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import type { DashboardDelivery } from "@/utils/types";

function formatDate(raw: string): string {
	const d = new Date(raw);
	return d.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

const deliveryColor = {
	delivered: "green" as const,
	"in-transit": "blue" as const,
	scheduled: "amber" as const,
	cancelled: "red" as const,
};

const deliveryColumns: Column<DashboardDelivery>[] = [
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
			<span className="text-gray-600">{row.items.join(", ")}</span>
		),
	},
	{
		header: "Status",
		accessorKey: "status",
		cell: (row) => (
			<Badge variant={deliveryColor[row.status]}>{row.status}</Badge>
		),
	},
];

interface DeliveryTableProps {
	deliveries: DashboardDelivery[];
}

export default function DeliveryTable({ deliveries }: DeliveryTableProps) {
	return (
		<Card>
			<DataTable
				columns={deliveryColumns}
				data={deliveries}
				keyExtractor={(d) => `${d.date}-${d.items.join(",")}`}
				emptyMessage="No deliveries yet."
			/>
		</Card>
	);
}
