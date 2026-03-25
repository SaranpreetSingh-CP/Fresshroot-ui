"use client";

import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import type { Column } from "@/components/DataTable";
import type { Lead, LeadStatus } from "@/utils/types";

const STATUS_VARIANT: Record<
	LeadStatus,
	"green" | "amber" | "red" | "gray" | "blue"
> = {
	new: "blue",
	contacted: "amber",
	converted: "green",
};

interface LeadTableProps {
	data: Lead[];
	onStatusChange?: (id: string, status: LeadStatus) => void;
	isUpdating?: boolean;
}

export default function LeadTable({
	data,
	onStatusChange,
	isUpdating,
}: LeadTableProps) {
	const columns: Column<Lead>[] = [
		{ header: "Name", accessorKey: "name" },
		{
			header: "Phone",
			accessorKey: "phone",
			cell: (row) => (
				<a href={`tel:${row.phone}`} className="text-green-700 hover:underline">
					{row.phone}
				</a>
			),
		},
		{
			header: "Plan",
			accessorKey: "planType",
			cell: (row) => row.planType || "—",
		},
		{
			header: "Area",
			accessorKey: "areaSize",
			cell: (row) => row.areaSize || "—",
		},
		{
			header: "Date",
			accessorKey: "createdAt",
			cell: (row) =>
				row.createdAt
					? new Date(row.createdAt).toLocaleDateString("en-IN", {
							day: "2-digit",
							month: "short",
							year: "numeric",
						})
					: "—",
		},
		{
			header: "Status",
			accessorKey: "status",
			cell: (row) => (
				<Badge variant={STATUS_VARIANT[row.status] ?? "default"}>
					{row.status.charAt(0).toUpperCase() + row.status.slice(1)}
				</Badge>
			),
		},
		{
			header: "Actions",
			accessorKey: "actions",
			cell: (row) => (
				<div className="flex items-center gap-1.5">
					{row.status !== "contacted" && (
						<button
							disabled={isUpdating}
							onClick={(e) => {
								e.stopPropagation();
								onStatusChange?.(row.id, "contacted");
							}}
							className="rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100 disabled:opacity-50 transition"
						>
							Contacted
						</button>
					)}
					{row.status !== "converted" && (
						<button
							disabled={isUpdating}
							onClick={(e) => {
								e.stopPropagation();
								onStatusChange?.(row.id, "converted");
							}}
							className="rounded-lg border border-green-300 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-100 disabled:opacity-50 transition"
						>
							Converted
						</button>
					)}
				</div>
			),
		},
	];

	return (
		<DataTable
			columns={columns}
			data={data}
			keyExtractor={(row) => row.id}
			emptyMessage="No leads yet."
		/>
	);
}
