"use client";

import { memo } from "react";
import ProgressBar from "@/components/ProgressBar";
import { cn } from "@/utils/cn";
import type { VegetableUsage } from "@/utils/types";

interface VegetableUsageItemProps {
	usage: VegetableUsage;
	className?: string;
}

/**
 * Single vegetable usage row with name, stats line, and a mini progress bar.
 *
 * Visual states:
 * - **Green** → plenty remaining (> 30 %)
 * - **Amber** → low remaining (≤ 30 %)
 * - **Red** → exhausted / exceeded
 */
function VegetableUsageItem({ usage, className }: VegetableUsageItemProps) {
	const { vegetableName, limit, used, unit } = usage;

	const hasLimit = limit !== null && limit > 0;
	const remaining = hasLimit ? limit - used : null;
	const pctUsed = hasLimit ? Math.round((used / limit) * 100) : 0;

	const colour: "green" | "amber" | "red" = !hasLimit
		? "green"
		: pctUsed >= 100
			? "red"
			: pctUsed >= 70
				? "amber"
				: "green";

	const textColour: Record<string, string> = {
		green: "text-green-700",
		amber: "text-amber-700",
		red: "text-red-700",
	};

	const unitLabel = unit === "piece" ? "pcs" : unit;

	return (
		<div className={cn("space-y-1.5", className)}>
			{/* Name + stats */}
			<div className="flex items-center justify-between gap-2">
				<span className="text-sm font-medium text-gray-800 truncate">
					{vegetableName}
				</span>
				{hasLimit ? (
					<span
						className={cn(
							"text-xs font-semibold tabular-nums whitespace-nowrap",
							textColour[colour],
						)}
					>
						{used} / {limit} {unitLabel}
					</span>
				) : (
					<span className="text-xs text-gray-400 italic whitespace-nowrap">
						No limit
					</span>
				)}
			</div>

			{/* Progress bar */}
			{hasLimit && (
				<ProgressBar value={used} max={limit} colour={colour} height="h-1.5" />
			)}

			{/* Remaining label */}
			{hasLimit && remaining !== null && (
				<p className={cn("text-[11px] font-medium", textColour[colour])}>
					{remaining > 0 ? `${remaining} ${unitLabel} left` : `Exhausted`}
				</p>
			)}
		</div>
	);
}

export default memo(VegetableUsageItem);
