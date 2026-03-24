import Card, { CardHeader, CardTitle } from "@/components/Card";
import Badge from "@/components/Badge";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import type { AdminExpense } from "@/utils/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

/** Resolve relative billUrl paths against the backend origin */
function resolveUrl(url: string): string {
	if (/^https?:\/\//i.test(url)) return url;
	const origin = API_BASE.replace(/\/api\/?$/, "");
	return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
}

function formatDate(raw: string): string {
	const d = new Date(raw);
	return d.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

function buildColumns(
	onEdit?: (expense: AdminExpense) => void,
): Column<AdminExpense>[] {
	const cols: Column<AdminExpense>[] = [
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
			cell: (row) => (
				<span className="text-gray-600">{formatDate(row.date)}</span>
			),
		},
	];

	if (onEdit) {
		cols.push({
			header: "Actions",
			accessorKey: "actions",
			cell: (row) => {
				const hasBill = !!row.billUrl;
				return (
					<div className="flex items-center gap-2">
						{hasBill ? (
							<a
								href={resolveUrl(row.billUrl!)}
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
									className="h-4 w-4"
								>
									<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
									<circle cx={12} cy={12} r={3} />
								</svg>
							</a>
						) : (
							<span className="group relative rounded p-1 text-gray-300 cursor-not-allowed">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth={2}
									strokeLinecap="round"
									strokeLinejoin="round"
									className="h-4 w-4"
								>
									<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
									<circle cx={12} cy={12} r={3} />
								</svg>
								<span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-[11px] text-white opacity-0 shadow transition-opacity group-hover:opacity-100">
									No bill uploaded
								</span>
							</span>
						)}
						<button
							onClick={() => onEdit(row)}
							className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 transition"
						>
							Edit
						</button>
					</div>
				);
			},
		});
	}

	return cols;
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
	const columns = buildColumns(onEdit);
	const colCount = columns.length;

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Expense Tracker</CardTitle>
					{onAdd && (
						<button
							onClick={onAdd}
							className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 transition"
						>
							+ Add Expense
						</button>
					)}
				</div>
			</CardHeader>
			<DataTable
				columns={columns}
				data={expenses}
				keyExtractor={(e, i) =>
					e.id ?? `${e.category}-${e.date}-${e.amount}-${i}`
				}
				emptyMessage="No expenses recorded."
				className="max-h-96"
				footer={
					expenses.length > 0 ? (
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
							<td colSpan={colCount - 3} />
						</tr>
					) : undefined
				}
			/>
		</Card>
	);
}
