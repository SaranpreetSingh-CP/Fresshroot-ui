"use client";

import { cn } from "@/utils/cn";

type LimitStatus = "safe" | "warning" | "exceeded" | "none";

interface LimitBadgeProps {
	remaining: number;
	unit: string;
	status: LimitStatus;
	className?: string;
}

const STATUS_STYLES: Record<LimitStatus, string> = {
	safe: "bg-green-50 text-green-700 border-green-200",
	warning: "bg-amber-50 text-amber-700 border-amber-200",
	exceeded: "bg-red-50 text-red-700 border-red-200",
	none: "bg-gray-50 text-gray-500 border-gray-200",
};

const STATUS_ICON: Record<LimitStatus, string> = {
	safe: "✓",
	warning: "⚠",
	exceeded: "✕",
	none: "∞",
};

/**
 * Compact badge showing remaining quantity for a vegetable.
 *
 * - **safe**: plenty of remaining qty
 * - **warning**: nearing limit (≤ 20 %)
 * - **exceeded**: over the limit
 * - **none**: no limit set for this vegetable
 */
export default function LimitBadge({
	remaining,
	unit,
	status,
	className,
}: LimitBadgeProps) {
	const label =
		status === "none"
			? "No limit"
			: status === "exceeded"
				? "Limit exceeded"
				: `Remaining: ${remaining} ${unit}`;

	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
				STATUS_STYLES[status],
				className,
			)}
			title={label}
		>
			<span className="text-[10px] leading-none">{STATUS_ICON[status]}</span>
			{label}
		</span>
	);
}

/** Derive `LimitStatus` from limit & remaining values. */
export function deriveLimitStatus(
	limit: number | null,
	remaining: number,
): LimitStatus {
	if (limit === null) return "none";
	if (remaining <= 0) return "exceeded";
	if (remaining <= limit * 0.2) return "warning";
	return "safe";
}
