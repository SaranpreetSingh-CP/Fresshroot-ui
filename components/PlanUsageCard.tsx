"use client";

import { useMemo } from "react";
import { cn } from "@/utils/cn";
import ProgressBar from "@/components/ProgressBar";
import VegetableUsageItem from "@/components/VegetableUsageItem";
import type { PlanUsage, VegetableUsage, PieceUsageItem } from "@/utils/types";

interface PlanUsageCardProps {
	usage: PlanUsage;
	/** Extra planned quantity from upcoming deliveries (for live calculation) */
	plannedQty?: number;
	className?: string;
}

export default function PlanUsageCard({
	usage,
	plannedQty = 0,
	className,
}: PlanUsageCardProps) {
	const unit = usage.unit || "kg";
	const effectiveRemaining = usage.remainingQty - plannedQty;
	const usedPercent = Math.round((usage.usedQty / usage.totalQty) * 100);
	const plannedPercent = Math.round((plannedQty / usage.totalQty) * 100);
	const isLow = effectiveRemaining <= usage.totalQty * 0.15;
	const isOver = effectiveRemaining < 0;

	// Split vegetable usage into kg and piece groups
	const kgUsage = useMemo(() => {
		return (usage.vegetableUsage ?? []).filter((v) => v.unit !== "piece");
	}, [usage.vegetableUsage]);

	// Piece usage comes directly from the API as a separate array
	const pieceItems = useMemo(() => {
		return usage.pieceUsage ?? [];
	}, [usage.pieceUsage]);

	return (
		<div
			className={cn(
				"rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6",
				className,
			)}
		>
			{/* ─── KG SECTION ─────────────────────────────────── */}
			<div>
				<h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
					Plan Usage
				</h3>

				{/* Main progress bar */}
				<div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-gray-100">
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

				{/* Stats row */}
				<div className="mt-5 grid grid-cols-3 gap-4 text-center">
					<div>
						<p className="text-2xl font-bold text-gray-900 tabular-nums">
							{usage.totalQty}
							<span className="ml-1 text-sm font-normal text-gray-400">
								{unit}
							</span>
						</p>
						<p className="mt-0.5 text-xs text-gray-500">Total</p>
					</div>

					<div>
						<p className="text-2xl font-bold text-green-600 tabular-nums">
							{usage.usedQty}
							<span className="ml-1 text-sm font-normal text-green-400">
								{unit}
							</span>
						</p>
						<p className="mt-0.5 text-xs text-gray-500">Used</p>
					</div>

					<div>
						<p
							className={cn(
								"text-2xl font-bold tabular-nums",
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
									"ml-1 text-sm font-normal",
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
						<p className="mt-0.5 text-xs text-gray-500">Remaining</p>
					</div>
				</div>

				{/* Warnings */}
				{isOver && (
					<p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
						⚠️ You&apos;ve exceeded your plan limit by{" "}
						{Math.abs(effectiveRemaining)} {unit}
					</p>
				)}
				{isLow && !isOver && (
					<p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
						⚡ Running low — only {effectiveRemaining} {unit} remaining
					</p>
				)}
			</div>

			{/* ─── KG VEGETABLE LIMITS ────────────────────────── */}
			{kgUsage.length > 0 && (
				<div className="border-t border-gray-100 pt-5">
					<p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
						Kg Limits
					</p>
					<div className="grid gap-4 sm:grid-cols-2">
						{kgUsage.map((v) => (
							<VegetableUsageItem key={v.vegetableId} usage={v} />
						))}
					</div>
				</div>
			)}

			{/* ─── PIECE LIMITS ───────────────────────────────── */}
			<div className="border-t border-gray-100 pt-5">
				<p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
					Piece Limits
				</p>

				{pieceItems.length === 0 ? (
					<p className="text-sm text-gray-400 italic">
						No piece-based limits for this plan
					</p>
				) : (
					<div className="grid gap-4 sm:grid-cols-2">
						{pieceItems.map((v) => (
							<VegetableUsageItem
								key={v.vegetableId}
								usage={{
									vegetableId: v.vegetableId,
									vegetableName: v.vegetableName,
									limit: v.limitQty,
									used: v.usedQty,
									unit: "piece",
								}}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
