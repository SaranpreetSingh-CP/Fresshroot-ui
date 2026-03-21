import type { Metadata } from "next";
import { MOCK_CUSTOMERS, MOCK_ORDERS, MOCK_EXPENSES } from "@/utils/mock-data";
import Card, { CardHeader, CardTitle } from "@/components/Card";
import Badge from "@/components/Badge";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import type { Customer, Order, Expense } from "@/utils/types";

export const metadata: Metadata = {
	title: "Admin Dashboard | Freshroot Farms",
};

const orderStatusColor = {
	pending: "amber" as const,
	processing: "blue" as const,
	delivered: "green" as const,
	cancelled: "red" as const,
};

/* ── Column definitions ─────────────────────────────────────────── */
const customerColumns: Column<Customer>[] = [
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
		cell: (row) => <span className="text-gray-600">{row.email}</span>,
	},
	{
		header: "Plan",
		accessorKey: "plan",
		cell: (row) => <span className="text-gray-600">{row.plan}</span>,
	},
	{
		header: "Joined",
		accessorKey: "joinedDate",
		cell: (row) => <span className="text-gray-600">{row.joinedDate}</span>,
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

const orderColumns: Column<Order>[] = [
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
		cell: (row) => <span className="text-gray-600">{row.date}</span>,
	},
	{
		header: "Status",
		accessorKey: "status",
		cell: (row) => (
			<Badge variant={orderStatusColor[row.status]}>{row.status}</Badge>
		),
	},
];

const expenseColumns: Column<Expense>[] = [
	{
		header: "Category",
		accessorKey: "category",
		cell: (row) => <Badge variant="gray">{row.category}</Badge>,
	},
	{
		header: "Description",
		accessorKey: "description",
		cell: (row) => <span className="text-gray-600">{row.description}</span>,
	},
	{
		header: "Amount",
		accessorKey: "amount",
		cell: (row) => (
			<span className="font-medium text-gray-900">
				₹{row.amount.toLocaleString("en-IN")}
			</span>
		),
	},
	{
		header: "Date",
		accessorKey: "date",
		cell: (row) => <span className="text-gray-600">{row.date}</span>,
	},
];

export default function AdminDashboard() {
	const totalRevenue = MOCK_ORDERS.reduce((s, o) => s + o.total, 0);
	const totalExpenses = MOCK_EXPENSES.reduce((s, e) => s + e.amount, 0);

	return (
		<div className="space-y-10">
			<div>
				<h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
				<p className="mt-1 text-gray-600">
					Manage customers, orders, and financials.
				</p>
			</div>

			{/* ── Quick Stats ─────────────────────────────────────────── */}
			<div className="grid gap-4 sm:grid-cols-4">
				{[
					{
						label: "Total Customers",
						value: MOCK_CUSTOMERS.length,
						icon: "👥",
					},
					{
						label: "Active",
						value: MOCK_CUSTOMERS.filter((c) => c.status === "active").length,
						icon: "✅",
					},
					{
						label: "Revenue",
						value: `₹${totalRevenue.toLocaleString("en-IN")}`,
						icon: "💰",
					},
					{
						label: "Expenses",
						value: `₹${totalExpenses.toLocaleString("en-IN")}`,
						icon: "📊",
					},
				].map((s) => (
					<Card key={s.label}>
						<div className="flex items-center gap-4">
							<span className="text-3xl">{s.icon}</span>
							<div>
								<p className="text-xl font-bold text-gray-900">{s.value}</p>
								<p className="text-sm text-gray-500">{s.label}</p>
							</div>
						</div>
					</Card>
				))}
			</div>

			{/* ── Customer List ───────────────────────────────────────── */}
			<section id="customers">
				<Card>
					<CardHeader>
						<CardTitle>Customers</CardTitle>
					</CardHeader>
					<DataTable
						columns={customerColumns}
						data={MOCK_CUSTOMERS}
						keyExtractor={(c) => c.id}
					/>
				</Card>
			</section>

			{/* ── Orders Table ────────────────────────────────────────── */}
			<section id="orders">
				<Card>
					<CardHeader>
						<CardTitle>Recent Orders</CardTitle>
					</CardHeader>
					<DataTable
						columns={orderColumns}
						data={MOCK_ORDERS}
						keyExtractor={(o) => o.id}
					/>
				</Card>
			</section>

			{/* ── Expense Tracker ─────────────────────────────────────── */}
			<section id="expenses">
				<Card>
					<CardHeader>
						<CardTitle>Expense Tracker</CardTitle>
					</CardHeader>
					<DataTable
						columns={expenseColumns}
						data={MOCK_EXPENSES}
						keyExtractor={(e) => e.id}
						footer={
							<tr className="border-t border-gray-200">
								<td
									colSpan={2}
									className="pt-3 text-right font-semibold text-gray-700"
								>
									Total
								</td>
								<td className="pt-3 font-bold text-gray-900">
									₹{totalExpenses.toLocaleString("en-IN")}
								</td>
								<td />
							</tr>
						}
					/>
				</Card>
			</section>
		</div>
	);
}
