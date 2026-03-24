"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useCustomerDetails } from "@/hooks/useAdminMutations";
import CustomerInfoCard from "@/components/CustomerInfoCard";
import SubscriptionList from "@/components/SubscriptionList";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import CustomerDetailLoading from "./loading";

/* -- Helpers ------------------------------------------------------ */

function formatDate(raw: string): string {
	return new Date(raw).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

type StatusVariant = "green" | "amber" | "red" | "gray" | "blue";

function orderStatusVariant(s: string): StatusVariant {
	switch (s.toLowerCase()) {
		case "delivered":
			return "green";
		case "cancelled":
			return "red";
		case "processing":
		case "confirmed":
			return "blue";
		case "pending":
			return "amber";
		default:
			return "gray";
	}
}

/* -- Order type from API ------------------------------------------ */

interface PastOrder {
	id: string;
	items: { name: string; quantity: number; unit: string }[] | string[];
	totalAmount?: number;
	total?: number;
	deliveryDate?: string;
	date?: string;
	status: string;
}

/* -- Orders columns ----------------------------------------------- */

const orderColumns: Column<PastOrder>[] = [
	{
		header: "Order ID",
		accessorKey: "id",
		cell: (row) => (
			<span className="font-mono text-xs text-gray-600">
				{String(row.id).slice(0, 8)}…
			</span>
		),
	},
	{
		header: "Items",
		accessorKey: "items",
		cell: (row) => {
			const items = row.items ?? [];
			const label = items
				.map((i) =>
					typeof i === "string" ? i : `${i.name} (${i.quantity} ${i.unit})`,
				)
				.join(", ");
			return (
				<span className="text-sm text-gray-700" title={label}>
					{label || "—"}
				</span>
			);
		},
	},
	{
		header: "Total",
		accessorKey: "totalAmount",
		cell: (row) => {
			const amt = row.totalAmount ?? row.total;
			return (
				<span className="font-medium text-gray-900">
					{amt != null ? `₹${amt.toLocaleString("en-IN")}` : "—"}
				</span>
			);
		},
	},
	{
		header: "Date",
		accessorKey: "deliveryDate",
		cell: (row) => {
			const d = row.deliveryDate ?? row.date;
			return <span className="text-gray-600">{d ? formatDate(d) : "—"}</span>;
		},
	},
	{
		header: "Status",
		accessorKey: "status",
		cell: (row) => (
			<Badge variant={orderStatusVariant(row.status)}>
				{row.status.toLowerCase()}
			</Badge>
		),
	},
];

/* -- Page Component ----------------------------------------------- */

export default function CustomerDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const router = useRouter();
	const { data, isLoading, isError, error } = useCustomerDetails(id);

	if (isLoading) return <CustomerDetailLoading />;

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
				<span className="text-4xl">⚠️</span>
				<p className="text-lg font-medium text-gray-900">
					Something went wrong
				</p>
				<p className="text-sm text-gray-500">
					{error instanceof Error
						? error.message
						: "Unable to load customer details."}
				</p>
				<button
					onClick={() => router.back()}
					className="mt-2 text-sm font-medium text-green-700 hover:underline"
				>
					← Go back
				</button>
			</div>
		);
	}

	if (!data) return null;

	const { customer, subscriptions = [], pastOrders = [] } = data;

	return (
		<div className="space-y-8">
			{/* Back button */}
			<button
				onClick={() => router.back()}
				className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
			>
				<span>←</span> Back
			</button>

			{/* Page heading */}
			<h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>

			{/* Section 1 — Customer Info */}
			<CustomerInfoCard customer={customer} />

			{/* Section 2 — Subscriptions */}
			<SubscriptionList subscriptions={subscriptions} />

			{/* Section 3 — Past Orders */}
			<Card>
				<h2 className="mb-4 text-lg font-bold text-gray-900">Past Orders</h2>
				<DataTable<PastOrder>
					columns={orderColumns}
					data={pastOrders}
					keyExtractor={(o) => String(o.id)}
					emptyMessage="No orders found for this customer."
				/>
			</Card>
		</div>
	);
}
