import Card, { CardHeader, CardTitle } from "@/components/Card";
import Badge from "@/components/Badge";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import type { AdminCustomer } from "@/utils/types";

function formatDate(raw: string): string {
	const d = new Date(raw);
	return d.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

const columns: Column<AdminCustomer>[] = [
	{
		header: "Name",
		accessorKey: "name",
		cell: (row) => (
			<span className="font-medium text-gray-900">{row.name}</span>
		),
	},
	{
		header: "Email",
		accessorKey: "email",
		cell: (row) => <span className="text-gray-600">{row.email ?? "—"}</span>,
	},
	{
		header: "Plan",
		accessorKey: "plan",
		cell: (row) => <span className="text-gray-600">{row.plan}</span>,
	},
	{
		header: "Joined",
		accessorKey: "joined",
		cell: (row) => (
			<span className="text-gray-600">{formatDate(row.joined)}</span>
		),
	},
	{
		header: "Status",
		accessorKey: "status",
		cell: (row) => (
			<Badge variant={row.status === "active" ? "green" : "gray"}>
				{row.status}
			</Badge>
		),
	},
];

interface CustomersTableProps {
	customers: AdminCustomer[];
}

export default function CustomersTable({ customers }: CustomersTableProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Customers</CardTitle>
			</CardHeader>
			<DataTable
				columns={columns}
				data={customers}
				keyExtractor={(c) => `${c.name}-${c.joined}`}
				emptyMessage="No customers found."
				className="max-h-96"
			/>
		</Card>
	);
}
