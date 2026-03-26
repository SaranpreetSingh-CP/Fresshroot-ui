"use client";

import Badge from "@/components/Badge";
import { cn } from "@/utils/cn";
import type { CustomerUpcomingDelivery } from "@/utils/types";

function formatDate(iso: string) {
	const d = new Date(iso);
	return d.toLocaleDateString("en-IN", {
		weekday: "short",
		day: "2-digit",
		month: "short",
	});
}

function formatItems(items: CustomerUpcomingDelivery["items"]): string {
	return items
		.map((i) => `${i.vegetableName} ${i.quantity}${i.unit}`)
		.join(", ");
}

function getRelativeLabel(iso: string): string | null {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const d = new Date(iso);
	d.setHours(0, 0, 0, 0);
	const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
	if (diff === 0) return "Today";
	if (diff === 1) return "Tomorrow";
	return null;
}

const STATUS_COLOR: Record<string, "green" | "blue" | "amber" | "gray"> = {
	scheduled: "blue",
	"in-transit": "amber",
	"out-for-delivery": "green",
	skipped: "gray",
};

interface UpcomingDeliveriesProps {
	/** All upcoming deliveries (component will skip the first one) */
	deliveries: CustomerUpcomingDelivery[];
	onEdit?: (delivery: CustomerUpcomingDelivery) => void;
	onSkip?: (delivery: CustomerUpcomingDelivery) => void;
	isSkipping?: boolean;
}

/**
 * Shows upcoming deliveries (excluding the first one which is shown
 * in NextDeliveryCard). Highlights "Today" and "Tomorrow".
 */
export default function UpcomingDeliveries({
	deliveries,
	onEdit,
	onSkip,
	isSkipping,
}: UpcomingDeliveriesProps) {
	// Skip the first delivery (shown in NextDeliveryCard) and limit to 4
	const rest = deliveries.slice(1, 5);

	return (
		<div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
			<div className="px-5 py-4 border-b border-gray-100">
				<h3 className="text-sm font-semibold text-gray-900">
					Upcoming Deliveries
				</h3>
			</div>

			{rest.length === 0 ? (
				<div className="py-8 text-center">
					<p className="text-3xl">📅</p>
					<p className="mt-2 text-sm text-gray-400">
						No more upcoming deliveries
					</p>
				</div>
			) : (
				<div className="divide-y divide-gray-100">
					{rest.map((d) => {
						const isSkipped = d.status === "skipped";
						const relative = getRelativeLabel(d.date);

						return (
							<div
								key={d.id}
								className={cn(
									"flex items-center gap-4 px-5 py-3.5",
									isSkipped && "opacity-50",
									relative && "bg-amber-50/40",
								)}
							>
								{/* Date */}
								<div className="flex-shrink-0 w-20">
									{relative && (
										<p className="text-[10px] font-bold uppercase text-amber-600 mb-0.5">
											{relative}
										</p>
									)}
									<p className="text-sm font-medium text-gray-800">
										{formatDate(d.date)}
									</p>
								</div>

								{/* Items */}
								<div className="flex-1 min-w-0">
									<p className="text-sm text-gray-600 truncate">
										{d.items.length > 0 ? formatItems(d.items) : "No items yet"}
									</p>
								</div>

								{/* Status */}
								<Badge variant={STATUS_COLOR[d.status] ?? "gray"}>
									{d.status
										.replace(/-/g, " ")
										.replace(/\b\w/g, (c) => c.toUpperCase())}
								</Badge>

								{/* Actions */}
								{!isSkipped && (
									<div className="flex items-center gap-1.5 flex-shrink-0">
										<button
											onClick={() => onEdit?.(d)}
											className="rounded-lg px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-50 transition"
										>
											Edit
										</button>
										<button
											disabled={isSkipping}
											onClick={() => onSkip?.(d)}
											className="rounded-lg px-2.5 py-1 text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition"
										>
											Skip
										</button>
									</div>
								)}
								{isSkipped && (
									<span className="text-[11px] text-gray-400 italic flex-shrink-0">
										Skipped
									</span>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
