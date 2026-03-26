"use client";

import { useState, useMemo } from "react";
import Card, { CardHeader, CardTitle } from "@/components/Card";
import Badge from "@/components/Badge";
import type { AdminExpense } from "@/utils/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";
const PAGE_SIZE = 8;

function resolveUrl(url: string): string {
	if (/^https?:\/\//i.test(url)) return url;
	const origin = API_BASE.replace(/\/api\/?$/, "");
	return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
}

function formatDate(raw: string): string {
	const d = new Date(raw);
	return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

interface ExpenseTableProps {
	expenses: AdminExpense[];
	totalExpenses: number;
	onAdd?: () => void;
	onEdit?: (expense: AdminExpense) => void;
}

export default function ExpenseTable({
	expenses = [],
	totalExpenses = 0,
	onAdd,
	onEdit,
}: ExpenseTableProps) {
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [showAll, setShowAll] = useState(false);

	const categories = useMemo(() => {
		const set = new Set(expenses.map((e) => e.category));
		return Array.from(set).sort();
	}, [expenses]);

	const filtered = useMemo(() => {
		if (categoryFilter === "all") return expenses;
		return expenses.filter((e) => e.category === categoryFilter);
	}, [expenses, categoryFilter]);

	const visible = showAll ? filtered : filtered.slice(0, PAGE_SIZE);
	const hasMore = filtered.length > PAGE_SIZE;

	const thisMonthTotal = useMemo(() => {
		const now = new Date();
		const m = now.getMonth();
		const y = now.getFullYear();
		return expenses
			.filter((e) => {
				const d = new Date(e.date);
				return d.getMonth() === m && d.getFullYear() === y;
			})
			.reduce((sum, e) => sum + (e.amount ?? 0), 0);
	}, [expenses]);

	const filteredTotal = useMemo(
		() =>
			categoryFilter === "all"
				? totalExpenses
				: filtered.reduce((s, e) => s + (e.amount ?? 0), 0),
		[categoryFilter, totalExpenses, filtered],
	);

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between flex-wrap gap-3">
					<div className="flex items-center gap-3 flex-wrap">
						<div className="flex items-center gap-2">
							<span className="text-lg">📊</span>
							<CardTitle>Expense Tracker</CardTitle>
						</div>
						<span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
							₹{thisMonthTotal.toLocaleString("en-IN")} this month
						</span>
					</div>
					{onAdd && (
						<button
							onClick={onAdd}
							className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 transition"
						>
							+ Add Expense
						</button>
					)}
				</div>

				{/* Category filter chips */}
				{categories.length > 1 && (
					<div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-none">
						<button
							type="button"
							onClick={() => {
								setCategoryFilter("all");
								setShowAll(false);
							}}
							className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition ${categoryFilter === "all" ? "bg-green-600 text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200"}`}
						>
							All
						</button>
						{categories.map((cat) => (
							<button
								key={cat}
								type="button"
								onClick={() => {
									setCategoryFilter(cat);
									setShowAll(false);
								}}
								className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition capitalize ${categoryFilter === cat ? "bg-green-600 text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200"}`}
							>
								{cat}
							</button>
						))}
					</div>
				)}
			</CardHeader>

			{/* List */}
			<div className="px-5 pb-4">
				{visible.length === 0 && (
					<p className="py-8 text-center text-sm text-gray-400">
						No expenses recorded.
					</p>
				)}

				<ul className="divide-y divide-gray-100">
					{visible.map((exp, i) => (
						<li
							key={exp.id ?? `${exp.category}-${exp.date}-${exp.amount}-${i}`}
							className="group flex items-center justify-between gap-3 rounded-lg p-3 transition hover:bg-gray-50"
						>
							{/* Left */}
							<div className="min-w-0">
								<div className="mb-0.5">
									<Badge variant="gray">{exp.category}</Badge>
								</div>
								<p className="truncate text-sm text-gray-600">
									{exp.description || "—"}
								</p>
							</div>

							{/* Right */}
							<div className="flex items-center gap-3 shrink-0">
								<div className="text-right">
									<p className="font-semibold text-gray-900 text-sm">
										₹{exp.amount.toLocaleString("en-IN")}
									</p>
									<p className="text-[11px] text-gray-400">
										{formatDate(exp.date)}
									</p>
								</div>
								<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
									{exp.billUrl && (
										<a
											href={resolveUrl(exp.billUrl)}
											target="_blank"
											rel="noopener noreferrer"
											title="View bill"
											className="rounded p-1 text-green-700 hover:bg-green-50 transition"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth={2}
												strokeLinecap="round"
												strokeLinejoin="round"
												className="h-3.5 w-3.5"
											>
												<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
												<circle cx={12} cy={12} r={3} />
											</svg>
										</a>
									)}
									{onEdit && (
										<button
											onClick={() => onEdit(exp)}
											className="rounded p-1 text-gray-400 hover:text-blue-700 hover:bg-blue-50 transition"
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
								</div>
							</div>
						</li>
					))}
				</ul>

				{/* Total footer */}
				{filtered.length > 0 && (
					<div className="flex items-center justify-between border-t border-gray-200 pt-3 mt-1 px-3">
						<span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
							Total
						</span>
						<span className="font-bold text-gray-900 text-sm">
							₹{filteredTotal.toLocaleString("en-IN")}
						</span>
					</div>
				)}

				{hasMore && (
					<div className="pt-3 text-center">
						<button
							type="button"
							onClick={() => setShowAll((p) => !p)}
							className="text-xs font-medium text-green-700 hover:text-green-800 transition"
						>
							{showAll ? "Show Less" : `View All (${filtered.length})`}
						</button>
					</div>
				)}
			</div>
		</Card>
	);
}
