"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Card, { CardHeader, CardTitle } from "@/components/Card";
import Badge from "@/components/Badge";
import type { AdminCustomer } from "@/utils/types";

interface CustomersTableProps {
	customers: AdminCustomer[];
	onEdit?: (customer: AdminCustomer) => void;
	onAdd?: () => void;
	onViewPlan?: (customer: AdminCustomer) => void;
}

export default function CustomersTable({
	customers,
	onEdit,
	onAdd,
	onViewPlan,
}: CustomersTableProps) {
	const router = useRouter();
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<
		"all" | "active" | "inactive"
	>("all");
	const filtered = useMemo(() => {
		let list = customers;
		if (search.trim()) {
			const q = search.toLowerCase();
			list = list.filter(
				(c) =>
					c.name?.toLowerCase().includes(q) ||
					c.phone?.toLowerCase().includes(q) ||
					c.email?.toLowerCase().includes(q),
			);
		}
		if (statusFilter !== "all") {
			list = list.filter((c) => c.status === statusFilter);
		}
		return list;
	}, [customers, search, statusFilter]);

	function getPlanLabel(c: AdminCustomer): string {
		if (!c.plan) return "—";
		if (typeof c.plan === "object") return `${c.plan.totalQty} kg`;
		return c.plan;
	}

	return (
		<Card className="flex flex-col max-h-[600px] overflow-hidden">
			{/* Sticky header */}
			<CardHeader>
				<div className="flex items-center justify-between flex-wrap gap-3">
					<div className="flex items-center gap-2">
						<span className="text-lg">👥</span>
						<CardTitle>Customers</CardTitle>
					</div>
					{onAdd && (
						<button
							onClick={onAdd}
							className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 transition"
						>
							+ Add Customer
						</button>
					)}
				</div>

				{/* Search + filter */}
				<div className="flex items-center gap-2 mt-3">
					<div className="relative flex-1">
						<svg
							className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<circle cx={11} cy={11} r={8} />
							<path d="M21 21l-4.35-4.35" />
						</svg>
						<input
							type="text"
							placeholder="Search name, phone, email…"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full rounded-lg border border-gray-200 py-1.5 pl-8 pr-3 text-xs text-gray-700 placeholder:text-gray-400 focus:border-green-400 focus:ring-1 focus:ring-green-200 outline-none transition"
						/>
					</div>
					<div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5">
						{(["all", "active", "inactive"] as const).map((s) => (
							<button
								key={s}
								type="button"
								onClick={() => {
									setStatusFilter(s);
								}}
								className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition ${
									statusFilter === s
										? "bg-white text-gray-900 shadow-sm"
										: "text-gray-500 hover:text-gray-700"
								}`}
							>
								{s}
							</button>
						))}
					</div>
				</div>
			</CardHeader>

			{/* Scrollable list */}
			<div className="flex-1 overflow-y-auto px-5 pb-4">
				{filtered.length === 0 && (
					<p className="py-8 text-center text-sm text-gray-400">
						{search ? "No matching customers." : "No customers found."}
					</p>
				)}

				<ul className="divide-y divide-gray-100">
					{filtered.map((c) => (
						<li key={c.id ?? c.name}>
							<div
								role="button"
								tabIndex={0}
								onClick={() =>
									router.push(`/dashboard/admin/customers/${c.id}`)
								}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ")
										router.push(`/dashboard/admin/customers/${c.id}`);
								}}
								className="flex w-full items-center justify-between gap-3 rounded-lg p-3 text-left transition hover:bg-gray-50 active:bg-gray-100 cursor-pointer"
							>
								{/* Left */}
								<div className="min-w-0">
									<p className="truncate font-semibold text-gray-900 text-sm">
										{c.name}
									</p>
									<p className="truncate text-xs text-gray-500">
										{c.phone ?? "—"}
									</p>
								</div>

								{/* Right */}
								<div className="flex items-center gap-3 shrink-0">
									<span className="hidden sm:inline text-xs text-gray-600">
										{getPlanLabel(c)}
									</span>

									{onViewPlan && c.plan && (
										<button
											onClick={(e) => {
												e.stopPropagation();
												onViewPlan(c);
											}}
											className="rounded px-1.5 py-0.5 text-[11px] font-medium text-green-700 hover:bg-green-50 transition"
										>
											View
										</button>
									)}

									<Badge variant={c.status === "active" ? "green" : "gray"}>
										{c.status}
									</Badge>

									{onEdit && (
										<button
											onClick={(e) => {
												e.stopPropagation();
												onEdit(c);
											}}
											className="rounded p-1 text-gray-400 hover:text-green-700 hover:bg-green-50 transition"
											title="Edit"
										>
											<svg
												className="h-3.5 w-3.5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth={2}
											>
												<path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
											</svg>
										</button>
									)}

									<svg
										className="h-4 w-4 text-gray-300"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
		</Card>
	);
}
