"use client";

import { memo } from "react";
import ProgressBar from "@/components/ProgressBar";
import { cn } from "@/utils/cn";

export interface VegLimit {
	vegetableId: number;
	vegetableName: string;
	limitQty: number;
	usedQty?: number;
	remainingQty?: number;
	unit?: "kg" | "piece";
}

interface VegetableLimitListProps {
	limits: VegLimit[];
	className?: string;
}

/**
 * Renders a list of per-vegetable limits with mini progress bars.
 * If usage data (`usedQty`) is present, shows used / limit; otherwise shows limit only.
 */
function VegetableLimitList({ limits, className }: VegetableLimitListProps) {
	if (limits.length === 0) {
		return (
			<p className="text-sm text-gray-400 italic py-2">
				No vegetable limits for this plan
			</p>
		);
	}

	return (
		<div className={cn("space-y-3", className)}>
			{limits.map((vl) => {
				const unitLabel = vl.unit === "kg" ? "kg" : "pcs";
				const hasUsage = vl.usedQty != null;
				const used = vl.usedQty ?? 0;
				const remaining = vl.remainingQty ?? vl.limitQty - used;
				const pct =
					vl.limitQty > 0 ? Math.round((used / vl.limitQty) * 100) : 0;
				const isExhausted = remaining <= 0;
				const isLow = !isExhausted && pct >= 70;

				return (
					<div
						key={vl.vegetableId}
						className="rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2.5 space-y-1.5"
					>
						{/* Header: name + limit */}
						<div className="flex items-center justify-between gap-2">
							<span className="text-sm font-medium text-gray-800 truncate">
								{vl.vegetableName}
							</span>
							<span
								className={cn(
									"text-xs font-semibold tabular-nums whitespace-nowrap",
									isExhausted
										? "text-red-600"
										: isLow
											? "text-amber-600"
											: "text-gray-600",
								)}
							>
								{hasUsage
									? `${used} / ${vl.limitQty} ${unitLabel}`
									: `${vl.limitQty} ${unitLabel}`}
							</span>
						</div>

						{/* Progress bar (only when usage data available) */}
						{hasUsage && (
							<ProgressBar value={used} max={vl.limitQty} height="h-1.5" />
						)}

						{/* Remaining label */}
						{hasUsage && (
							<p
								className={cn(
									"text-[11px] font-medium",
									isExhausted
										? "text-red-600"
										: isLow
											? "text-amber-600"
											: "text-green-600",
								)}
							>
								{isExhausted
									? "Exhausted"
									: `${remaining} ${unitLabel} remaining`}
							</p>
						)}
					</div>
				);
			})}
		</div>
	);
}

export default memo(VegetableLimitList);
