"use client";

import { useMemo } from "react";
import { cn } from "@/utils/cn";
import ProgressBar from "@/components/ProgressBar";
import type { PlanUsage } from "@/utils/types";

interface CompactPlanUsageProps {
	usage: PlanUsage;
	plannedQty?: number;
	className?: string;
}

/**
 * Compact plan-usage card for sidebar. Shows progress bar,
 * Total/Used/Remaining in a compact row, then piece limits as a tight list.
 */
export default function CompactPlanUsage({
	usage,
	plannedQty = 0,
	className,
}: CompactPlanUsageProps) {
	const unit = usage.unit || "kg";
	const effectiveRemaining = usage.remainingQty - plannedQty;
	const usedPercent = Math.round((usage.usedQty / usage.totalQty) * 100);
	const plannedPercent = Math.round((plannedQty / usage.totalQty) * 100);
	const isLow = effectiveRemaining <= usage.totalQty * 0.15;
	const isOver = effectiveRemaining < 0;

	const pieceItems = useMemo(() => usage.pieceUsage ?? [], [usage.pieceUsage]);
	const kgUsage = useMemo(
		() => (usage.vegetableUsage ?? []).filter((v) => v.unit !== "piece"),
		[usage.vegetableUsage],
	);

	return (
		<div
			className={cn(
				"rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4",
				className,
			)}
		>
			<h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
				Plan Usage
			</h3>

			{/* Progress bar */}
			<div className="space-y-1">
				<div className="flex items-center justify-between text-xs text-gray-500">
					<span>{usedPercent}% used</span>
					<span>
						{usage.usedQty} / {usage.totalQty} {unit}
					</span>
				</div>
				<div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
					<div className="flex h-full">
						<div
							className="bg-green-500 transition-all duration-500"
							style={{ width: `${Math.min(usedPercent, 100)}%` }}
						/>
						{plannedQty > 0 && (
							<div
								className="bg-amber-400 transition-all duration-500"
								style={{
									width: `${Math.min(plannedPercent, 100 - usedPercent)}%`,
								}}
							/>
						)}
					</div>
				</div>
			</div>

			{/* Compact stats */}
			<div className="grid grid-cols-3 gap-2 text-center text-sm">
				<div>
					<p className="font-bold text-gray-900 tabular-nums">
						{usage.totalQty}
						<span className="ml-0.5 text-[10px] font-normal text-gray-400">
							{unit}
						</span>
					</p>
					<p className="text-[10px] text-gray-500">Total</p>
				</div>
				<div>
					<p className="font-bold text-green-600 tabular-nums">
						{usage.usedQty}
						<span className="ml-0.5 text-[10px] font-normal text-green-400">
							{unit}
						</span>
					</p>
					<p className="text-[10px] text-gray-500">Used</p>
				</div>
				<div>
					<p
						className={cn(
							"font-bold tabular-nums",
							isOver
								? "text-red-600"
								: isLow
									? "text-amber-600"
									: "text-blue-600",
						)}
					>
						{effectiveRemaining}
						<span
							className={cn(
								"ml-0.5 text-[10px] font-normal",
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
					<p className="text-[10px] text-gray-500">Remaining</p>
				</div>
			</div>

			{/* Warning */}
			{isOver && (
				<p className="rounded-lg bg-red-50 px-3 py-1.5 text-[11px] font-medium text-red-700">
					⚠️ Exceeded by {Math.abs(effectiveRemaining)} {unit}
				</p>
			)}
			{isLow && !isOver && (
				<p className="rounded-lg bg-amber-50 px-3 py-1.5 text-[11px] font-medium text-amber-700">
					⚡ Only {effectiveRemaining} {unit} left
				</p>
			)}

			{/* Piece limits (compact list) */}
			{pieceItems.length > 0 && (
				<div className="border-t border-gray-100 pt-3 space-y-1.5">
					<p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
						Piece Limits
					</p>
					{pieceItems.map((v) => {
						const pct =
							v.limitQty > 0 ? Math.round((v.usedQty / v.limitQty) * 100) : 0;
						const exhausted = v.remainingQty <= 0;
						return (
							<div key={v.vegetableId} className="flex items-center gap-2">
								<span className="text-xs text-gray-700 truncate flex-1">
									{v.vegetableName}
								</span>
								<div className="w-16">
									<ProgressBar
										value={v.usedQty}
										max={v.limitQty}
										height="h-1"
									/>
								</div>
								<span
									className={cn(
										"text-[11px] tabular-nums font-medium whitespace-nowrap",
										exhausted ? "text-red-600" : "text-gray-500",
									)}
								>
									{v.usedQty}/{v.limitQty} pcs
								</span>
							</div>
						);
					})}
				</div>
			)}

			{/* Kg limits (compact list) */}
			{kgUsage.length > 0 && (
				<div className="border-t border-gray-100 pt-3 space-y-1.5">
					<p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
						Kg Limits
					</p>
					{kgUsage.map((v) => {
						const used = v.used ?? 0;
						const limit = v.limit ?? 0;
						const exhausted = limit > 0 && used >= limit;
						return (
							<div key={v.vegetableId} className="flex items-center gap-2">
								<span className="text-xs text-gray-700 truncate flex-1">
									{v.vegetableName}
								</span>
								{limit > 0 && (
									<div className="w-16">
										<ProgressBar value={used} max={limit} height="h-1" />
									</div>
								)}
								<span
									className={cn(
										"text-[11px] tabular-nums font-medium whitespace-nowrap",
										exhausted ? "text-red-600" : "text-gray-500",
									)}
								>
									{used}/{limit} kg
								</span>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
