import { PlanCardSkeleton } from "@/components/Skeleton";
import { Skeleton } from "@/components/Skeleton";

export default function STFLoading() {
	return (
		<section className="bg-gradient-to-b from-green-50 to-white py-20">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center space-y-4">
					<Skeleton className="h-10 w-72" />
					<Skeleton className="h-5 w-96" />
				</div>
				<div className="mt-16 grid gap-8 md:grid-cols-3">
					{[1, 2, 3].map((i) => (
						<PlanCardSkeleton key={i} />
					))}
				</div>
			</div>
		</section>
	);
}
