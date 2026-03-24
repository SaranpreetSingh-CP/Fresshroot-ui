"use client";

import { useRouter } from "next/navigation";
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

interface CustomersTableProps {
	customers: AdminCustomer[];
	onEdit?: (customer: AdminCustomer) => void;
	onAdd?: () => void;
}

export default function CustomersTable({
	customers,
	onEdit,
	onAdd,
}: CustomersTableProps) {
	const router = useRouter();
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
				<span className="text-gray-600">
					{row.joined ? formatDate(row.joined) : "—"}
				</span>
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
		...(onEdit
			? [
					{
						header: "",
						accessorKey: "id" as const,
						cell: (row: AdminCustomer) => (
							<button
								onClick={(e) => {
									e.stopPropagation();
									onEdit(row);
								}}
								className="rounded-lg px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-50 transition"
							>
								Edit
							</button>
						),
					},
				]
			: []),
	];

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Customers</CardTitle>
					{onAdd && (
						<button
							onClick={onAdd}
							className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 transition"
						>
							+ Add Customer
						</button>
					)}
				</div>
			</CardHeader>
			<DataTable
				columns={columns}
				data={customers}
				keyExtractor={(c) => c.id ?? `${c.name}-${c.joined}`}
				emptyMessage="No customers found."
				className="max-h-96"
				onRowClick={(c) => router.push(`/dashboard/admin/customers/${c.id}`)}
			/>
		</Card>
	);
}
