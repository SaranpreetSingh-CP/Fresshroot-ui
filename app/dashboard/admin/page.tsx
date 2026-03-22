"use client";

import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import AdminSummaryCards from "@/components/AdminSummaryCards";
import CustomersTable from "@/components/CustomersTable";
import OrdersTable from "@/components/OrdersTable";
import ExpenseTable from "@/components/ExpenseTable";
import { DashboardSkeleton } from "@/components/Skeleton";

export default function AdminDashboard() {
	const { data, isLoading, isError, error } = useAdminDashboard();

	if (isLoading) return <DashboardSkeleton />;

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
						: "Unable to load admin dashboard."}
				</p>
			</div>
		);
	}

	if (!data) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
				<span className="text-4xl">📭</span>
				<p className="text-lg font-medium text-gray-900">No data available</p>
				<p className="text-sm text-gray-500">
					Admin dashboard data could not be loaded.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-10">
			<div>
				<h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
				<p className="mt-1 text-gray-600">
					Manage customers, orders, and financials.
				</p>
			</div>

			{/* ── Quick Stats ─────────────────────────────────────────── */}
			<AdminSummaryCards
				totalCustomers={data.summary.totalCustomers}
				activeCustomers={data.summary.activeCustomers}
				revenue={data.summary.revenue}
				expenses={data.summary.expenses}
			/>

			{/* ── Customer List ───────────────────────────────────────── */}
			<section id="customers">
				<CustomersTable customers={data.customers} />
			</section>

			{/* ── Orders Table ────────────────────────────────────────── */}
			<section id="orders">
				<OrdersTable orders={data.orders} />
			</section>

			{/* ── Expense Tracker ─────────────────────────────────────── */}
			<section id="expenses">
				<ExpenseTable
					expenses={data.expenses}
					totalExpenses={data.summary.expenses}
				/>
			</section>
		</div>
	);
}
