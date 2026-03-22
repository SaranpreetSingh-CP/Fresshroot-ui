import Card, { CardHeader, CardTitle } from "@/components/Card";
import Badge from "@/components/Badge";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import type { AdminExpense } from "@/utils/types";

function formatDate(raw: string): string {
	const d = new Date(raw);
	return d.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

const columns: Column<AdminExpense>[] = [
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

interface ExpenseTableProps {
	expenses: AdminExpense[];
	totalExpenses: number;
	onAdd?: () => void;
}

export default function ExpenseTable({
	expenses = [],
	totalExpenses = 0,
	onAdd,
}: ExpenseTableProps) {
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
				keyExtractor={(e, i) => `${e.category}-${e.date}-${e.amount}-${i}`}
				emptyMessage="No expenses recorded."
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
							<td />
						</tr>
					) : undefined
				}
			/>
		</Card>
	);
}
