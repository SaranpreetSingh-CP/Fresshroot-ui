"use client";

import { cn } from "@/utils/cn";

interface QuantityTrackerProps {
	totalQty: number;
	usedQty: number;
	/** Quantity already allocated in the current order form (live-updating). */
	allocatedQty: number;
	unit?: string;
	className?: string;
}

/**
 * A compact header bar showing the global remaining quantity for the customer's plan.
 *
 * - Subtracts both `usedQty` (already delivered) and `allocatedQty` (current order form)
 * - Colour-coded: green → safe, amber → warning, red → exceeded
 */
export default function QuantityTracker({
	totalQty,
	usedQty,
	allocatedQty,
	unit = "kg",
	className,
}: QuantityTrackerProps) {
	const remaining = totalQty - usedQty - allocatedQty;
	const pct = totalQty > 0 ? ((usedQty + allocatedQty) / totalQty) * 100 : 0;

	const colour = remaining <= 0 ? "red" : pct >= 80 ? "amber" : "green";

	const barColours: Record<string, string> = {
		green: "bg-green-500",
		amber: "bg-amber-500",
		red: "bg-red-500",
	};

	const textColours: Record<string, string> = {
		green: "text-green-700",
		amber: "text-amber-700",
		red: "text-red-700",
	};

	const bgColours: Record<string, string> = {
		green: "bg-green-50 border-green-200",
		amber: "bg-amber-50 border-amber-200",
		red: "bg-red-50 border-red-200",
	};

	return (
		<div
			className={cn(
				"rounded-xl border p-3 space-y-2",
				bgColours[colour],
				className,
			)}
		>
			{/* Header */}
			<div className="flex items-center justify-between text-sm">
				<span className="font-medium text-gray-700">Plan Remaining</span>
				<span className={cn("font-bold", textColours[colour])}>
					{remaining < 0 ? 0 : remaining} {unit}
					{remaining < 0 && (
						<span className="ml-1 text-xs font-normal text-red-500">
							(exceeded by {Math.abs(remaining)} {unit})
						</span>
					)}
				</span>
			</div>

			{/* Progress bar */}
			<div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
				<div
					className={cn(
						"h-full rounded-full transition-all duration-300",
						barColours[colour],
					)}
					style={{ width: `${Math.min(pct, 100)}%` }}
				/>
			</div>

			{/* Breakdown */}
			<div className="flex items-center gap-3 text-[11px] text-gray-500">
				<span>
					Total: {totalQty} {unit}
				</span>
				<span>·</span>
				<span>
					Used: {usedQty} {unit}
				</span>
				{allocatedQty > 0 && (
					<>
						<span>·</span>
						<span className={textColours[colour]}>
							This order: {allocatedQty} {unit}
						</span>
					</>
				)}
			</div>
		</div>
	);
}
