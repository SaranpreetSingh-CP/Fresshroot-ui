import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

/* ── Column Definition ──────────────────────────────────────────── */
export interface Column<T> {
	/** Header label */
	header: string;
	/** Unique key for the column */
	accessorKey: string;
	/** Custom cell renderer — if omitted, renders `row[accessorKey]` as string */
	cell?: (row: T) => ReactNode;
	/** Extra classes on <th> and <td> */
	className?: string;
}

/* ── Props ──────────────────────────────────────────────────────── */
interface DataTableProps<T> {
	columns: Column<T>[];
	data: T[];
	/** Unique key extractor for each row */
	keyExtractor: (row: T) => string;
	/** Optional footer row */
	footer?: ReactNode;
	/** Show when data is empty */
	emptyMessage?: string;
}

export default function DataTable<T>({
	columns,
	data,
	keyExtractor,
	footer,
	emptyMessage = "No data available.",
}: DataTableProps<T>) {
	return (
		<div className="overflow-x-auto">
			<table className="w-full text-left text-sm">
				<thead>
					<tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
						{columns.map((col, i) => (
							<th
								key={col.accessorKey}
								className={cn(
									"pb-3",
									i < columns.length - 1 && "pr-4",
									col.className,
								)}
							>
								{col.header}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-100">
					{data.length === 0 ? (
						<tr>
							<td
								colSpan={columns.length}
								className="py-8 text-center text-gray-400"
							>
								{emptyMessage}
							</td>
						</tr>
					) : (
						data.map((row) => (
							<tr key={keyExtractor(row)}>
								{columns.map((col, i) => (
									<td
										key={col.accessorKey}
										className={cn(
											"py-3",
											i < columns.length - 1 && "pr-4",
											col.className,
										)}
									>
										{col.cell
											? col.cell(row)
											: String(
													(row as Record<string, unknown>)[col.accessorKey] ??
														"",
												)}
									</td>
								))}
							</tr>
						))
					)}
				</tbody>
				{footer && <tfoot>{footer}</tfoot>}
			</table>
		</div>
	);
}
