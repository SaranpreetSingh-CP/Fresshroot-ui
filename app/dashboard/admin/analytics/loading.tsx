import { StatCardSkeleton, Skeleton } from "@/components/Skeleton";

export default function AnalyticsLoading() {
	return (
		<div className="space-y-8 animate-pulse">
			{/* Header */}
			<div className="space-y-2">
				<Skeleton className="h-7 w-56" />
				<Skeleton className="h-4 w-72" />
			</div>

			{/* KPI Cards */}
			<div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
				{[1, 2, 3, 4].map((i) => (
					<StatCardSkeleton key={i} />
				))}
			</div>

			{/* Trend Chart */}
			<div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
				<Skeleton className="h-5 w-48" />
				<Skeleton className="h-64 w-full rounded-xl" />
			</div>

			{/* Missed Table */}
			<div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
				<Skeleton className="h-5 w-40" />
				<div className="space-y-3">
					{[1, 2, 3, 4].map((i) => (
						<Skeleton key={i} className="h-10 w-full" />
					))}
				</div>
			</div>

			{/* Top Vegetables */}
			<div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
				<Skeleton className="h-5 w-36" />
				<Skeleton className="h-64 w-full rounded-xl" />
			</div>
		</div>
	);
}
