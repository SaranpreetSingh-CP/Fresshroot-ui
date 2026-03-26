"use client";

import Badge from "@/components/Badge";
import { cn } from "@/utils/cn";
import type { CustomerUpcomingDelivery } from "@/utils/types";

interface NextDeliveryCardProps {
	delivery: CustomerUpcomingDelivery | null;
	onEdit?: (delivery: CustomerUpcomingDelivery) => void;
	onSkip?: (delivery: CustomerUpcomingDelivery) => void;
	isSkipping?: boolean;
}

function formatDay(iso: string) {
	const d = new Date(iso);
	return d.toLocaleDateString("en-IN", { weekday: "short" });
}

function formatFullDate(iso: string) {
	const d = new Date(iso);
	return d.toLocaleDateString("en-IN", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

const STATUS_COLOR: Record<string, "green" | "blue" | "amber" | "gray"> = {
	scheduled: "blue",
	"in-transit": "amber",
	"out-for-delivery": "green",
	skipped: "gray",
};

export default function NextDeliveryCard({
	delivery,
	onEdit,
	onSkip,
	isSkipping,
}: NextDeliveryCardProps) {
	if (!delivery) {
		return (
			<div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
				<p className="text-3xl">📦</p>
				<p className="mt-2 text-sm font-medium text-gray-500">
					No upcoming delivery scheduled
				</p>
				<p className="mt-1 text-xs text-gray-400">
					Create an order to get started
				</p>
			</div>
		);
	}

	const isSkipped = delivery.status === "skipped";
	const itemsSummary = delivery.items
		.slice(0, 3)
		.map((i) => `${i.vegetableName} ${i.quantity}${i.unit}`)
		.join(", ");
	const moreCount = delivery.items.length - 3;

	return (
		<div className="rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 p-5 shadow-sm">
			<div className="flex items-start justify-between gap-4">
				{/* Left: Date + Items */}
				<div className="min-w-0 flex-1 space-y-3">
					<div className="flex items-center gap-2">
						<p className="text-xs font-semibold uppercase tracking-wider text-green-600">
							Next Delivery
						</p>
						<Badge variant={STATUS_COLOR[delivery.status] ?? "gray"}>
							{delivery.status
								.replace(/-/g, " ")
								.replace(/\b\w/g, (c) => c.toUpperCase())}
						</Badge>
					</div>

					<div className="flex items-baseline gap-2">
						<p className="text-2xl font-bold text-gray-900">
							{formatDay(delivery.date)}, {formatFullDate(delivery.date)}
						</p>
					</div>

					{delivery.items.length > 0 ? (
						<p className="text-sm text-gray-600">
							{itemsSummary}
							{moreCount > 0 && (
								<span className="text-gray-400"> +{moreCount} more</span>
							)}
						</p>
					) : (
						<p className="text-sm text-gray-400 italic">No items yet</p>
					)}
				</div>

				{/* Right: Qty badge */}
				<div className="flex-shrink-0 rounded-xl bg-white/80 px-4 py-3 text-center shadow-sm">
					<p className="text-2xl font-bold text-green-700 tabular-nums">
						{delivery.totalQty}
					</p>
					<p className="text-[11px] text-gray-500">kg total</p>
				</div>
			</div>

			{/* Actions */}
			{!isSkipped && (
				<div className="mt-4 flex items-center gap-2">
					<button
						onClick={() => onEdit?.(delivery)}
						className="rounded-lg bg-white px-4 py-2 text-xs font-medium text-green-700 border border-green-200 hover:bg-green-50 transition"
					>
						✏️ Edit Order
					</button>
					<button
						disabled={isSkipping}
						onClick={() => onSkip?.(delivery)}
						className="rounded-lg bg-white px-4 py-2 text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition"
					>
						⏭️ Skip
					</button>
				</div>
			)}
			{isSkipped && (
				<p className="mt-4 text-xs text-gray-400 italic">
					This delivery has been skipped
				</p>
			)}
		</div>
	);
}
