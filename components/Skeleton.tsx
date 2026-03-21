import { cn } from "@/utils/cn";

/* ── Base Skeleton ──────────────────────────────────────────────── */
interface SkeletonProps {
	className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
	return (
		<div className={cn("animate-pulse rounded-md bg-gray-200", className)} />
	);
}

/* ── Card Skeleton ──────────────────────────────────────────────── */
export function CardSkeleton({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"rounded-2xl border border-gray-200 bg-white p-6 space-y-4",
				className,
			)}
		>
			<Skeleton className="h-5 w-1/3" />
			<Skeleton className="h-8 w-1/2" />
			<div className="space-y-2 pt-2">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-5/6" />
				<Skeleton className="h-4 w-4/6" />
				<Skeleton className="h-4 w-3/4" />
			</div>
			<Skeleton className="mt-4 h-10 w-full rounded-full" />
		</div>
	);
}

/* ── Plan Card Skeleton ─────────────────────────────────────────── */
export function PlanCardSkeleton() {
	return (
		<div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
			<div className="flex items-center justify-between">
				<Skeleton className="h-5 w-28" />
				<Skeleton className="h-5 w-16 rounded-full" />
			</div>
			<Skeleton className="h-9 w-24" />
			<div className="space-y-3 pt-2">
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className="flex items-center gap-2">
						<Skeleton className="h-4 w-4 rounded-full" />
						<Skeleton className="h-4 w-full" />
					</div>
				))}
			</div>
			<Skeleton className="mt-6 h-10 w-full rounded-full" />
		</div>
	);
}

/* ── Table Skeleton ─────────────────────────────────────────────── */
export function TableSkeleton({
	columns = 4,
	rows = 4,
}: {
	columns?: number;
	rows?: number;
}) {
	return (
		<div className="overflow-x-auto">
			<table className="w-full text-left text-sm">
				<thead>
					<tr className="border-b border-gray-200">
						{Array.from({ length: columns }).map((_, i) => (
							<th key={i} className="pb-3 pr-4">
								<Skeleton className="h-3 w-20" />
							</th>
						))}
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-100">
					{Array.from({ length: rows }).map((_, r) => (
						<tr key={r}>
							{Array.from({ length: columns }).map((_, c) => (
								<td key={c} className="py-3 pr-4">
									<Skeleton className={cn("h-4", c === 0 ? "w-28" : "w-20")} />
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

/* ── Stat Card Skeleton ─────────────────────────────────────────── */
export function StatCardSkeleton() {
	return (
		<div className="rounded-2xl border border-gray-200 bg-white p-6">
			<div className="flex items-center gap-4">
				<Skeleton className="h-10 w-10 rounded-lg" />
				<div className="space-y-2">
					<Skeleton className="h-6 w-16" />
					<Skeleton className="h-3 w-24" />
				</div>
			</div>
		</div>
	);
}

/* ── Page Skeleton (full dashboard) ─────────────────────────────── */
export function DashboardSkeleton() {
	return (
		<div className="space-y-10 animate-pulse">
			{/* Title */}
			<div className="space-y-2">
				<Skeleton className="h-7 w-48" />
				<Skeleton className="h-4 w-72" />
			</div>
			{/* Stats */}
			<div className="grid gap-4 sm:grid-cols-3">
				{[1, 2, 3].map((i) => (
					<StatCardSkeleton key={i} />
				))}
			</div>
			{/* Table */}
			<div className="rounded-2xl border border-gray-200 bg-white p-6">
				<Skeleton className="mb-4 h-5 w-36" />
				<TableSkeleton />
			</div>
		</div>
	);
}
