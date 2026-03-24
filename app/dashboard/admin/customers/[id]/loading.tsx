import { Skeleton, CardSkeleton, TableSkeleton } from "@/components/Skeleton";

export default function CustomerDetailLoading() {
	return (
		<div className="space-y-8 animate-pulse">
			{/* Back button */}
			<Skeleton className="h-5 w-20" />

			{/* Title */}
			<Skeleton className="h-7 w-48" />

			{/* Customer Info Card */}
			<CardSkeleton />

			{/* Subscriptions */}
			<div className="space-y-3">
				<Skeleton className="h-6 w-36" />
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{[1, 2].map((i) => (
						<CardSkeleton key={i} className="!p-4" />
					))}
				</div>
			</div>

			{/* Past Orders */}
			<div className="space-y-3">
				<Skeleton className="h-6 w-32" />
				<div className="rounded-2xl border border-gray-200 bg-white p-6">
					<TableSkeleton columns={5} rows={3} />
				</div>
			</div>
		</div>
	);
}
