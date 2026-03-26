"use client";

import { cn } from "@/utils/cn";

interface ProgressBarProps {
	/** Current value */
	value: number;
	/** Maximum value */
	max: number;
	/** Colour variant (auto-derived from percentage if omitted) */
	colour?: "green" | "amber" | "red";
	/** Bar height class (default: h-2) */
	height?: string;
	className?: string;
}

const BAR_COLOURS: Record<string, string> = {
	green: "bg-green-500",
	amber: "bg-amber-500",
	red: "bg-red-500",
};

/**
 * Reusable progress bar with auto-colour based on fill percentage.
 *
 * - ≤ 70 % → green
 * - 70–99 % → amber
 * - ≥ 100 % → red
 */
export default function ProgressBar({
	value,
	max,
	colour,
	height = "h-2",
	className,
}: ProgressBarProps) {
	const pct = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;
	const derived: "green" | "amber" | "red" =
		colour ?? (pct >= 100 ? "red" : pct >= 70 ? "amber" : "green");

	return (
		<div
			className={cn(
				"w-full overflow-hidden rounded-full bg-gray-100",
				height,
				className,
			)}
		>
			<div
				className={cn(
					"h-full rounded-full transition-all duration-500",
					BAR_COLOURS[derived],
				)}
				style={{ width: `${pct}%` }}
			/>
		</div>
	);
}
