"use client";

import { cn } from "@/utils/cn";
import ProgressBar from "@/components/ProgressBar";

interface PlanOverviewProps {
	totalQty: number;
	usedQty: number;
	remainingQty: number;
	unit?: string;
	className?: string;
}

/**
 * Compact plan overview: progress bar + Total / Used / Remaining stats.
 */
export default function PlanOverview({
	totalQty,
	usedQty,
	remainingQty,
	unit = "kg",
	className,
}: PlanOverviewProps) {
	const pct = totalQty > 0 ? Math.round((usedQty / totalQty) * 100) : 0;
	const isLow = remainingQty > 0 && remainingQty <= totalQty * 0.15;
	const isOver = remainingQty <= 0;

	return (
		<div className={cn("space-y-4", className)}>
			{/* Progress bar */}
			<div className="space-y-1.5">
				<div className="flex items-center justify-between text-xs text-gray-500">
					<span>{pct}% used</span>
					<span>
						{usedQty} / {totalQty} {unit}
					</span>
				</div>
				<ProgressBar value={usedQty} max={totalQty} height="h-3" />
			</div>

			{/* Stats row */}
			<div className="grid grid-cols-3 gap-3 text-center">
				<div className="rounded-xl bg-gray-50 px-3 py-2.5">
					<p className="text-lg font-bold text-gray-900 tabular-nums">
						{totalQty}
						<span className="ml-0.5 text-xs font-normal text-gray-400">
							{unit}
						</span>
					</p>
					<p className="text-[11px] text-gray-500">Total</p>
				</div>

				<div className="rounded-xl bg-green-50 px-3 py-2.5">
					<p className="text-lg font-bold text-green-700 tabular-nums">
						{usedQty}
						<span className="ml-0.5 text-xs font-normal text-green-400">
							{unit}
						</span>
					</p>
					<p className="text-[11px] text-gray-500">Used</p>
				</div>

				<div
					className={cn(
						"rounded-xl px-3 py-2.5",
						isOver ? "bg-red-50" : isLow ? "bg-amber-50" : "bg-blue-50",
					)}
				>
					<p
						className={cn(
							"text-lg font-bold tabular-nums",
							isOver
								? "text-red-700"
								: isLow
									? "text-amber-700"
									: "text-blue-700",
						)}
					>
						{remainingQty}
						<span
							className={cn(
								"ml-0.5 text-xs font-normal",
								isOver
									? "text-red-400"
									: isLow
										? "text-amber-400"
										: "text-blue-400",
							)}
						>
							{unit}
						</span>
					</p>
					<p className="text-[11px] text-gray-500">Remaining</p>
				</div>
			</div>

			{/* Warning */}
			{isOver && (
				<p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
					⚠️ Plan limit exceeded
				</p>
			)}
			{isLow && !isOver && (
				<p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
					⚡ Running low — only {remainingQty} {unit} remaining
				</p>
			)}
		</div>
	);
}
