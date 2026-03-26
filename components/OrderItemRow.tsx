"use client";

import { Input } from "@/components/FormFields";
import VegetableDropdown from "@/components/VegetableDropdown";
import LimitBadge, { deriveLimitStatus } from "@/components/LimitBadge";
import type { Vegetable } from "@/services/vegetable.service";
import type { OrderItemInput, VegetableUsage } from "@/utils/types";
import { cn } from "@/utils/cn";

export interface VegLimitInfo {
	limit: number | null;
	used: number;
	unit: "kg" | "piece";
	/** Quantity allocated by OTHER rows for the same vegetable in this order */
	otherRowsQty: number;
}

interface OrderItemRowProps {
	index: number;
	item: OrderItemInput;
	vegetables: Vegetable[];
	vegetablesLoading?: boolean;
	/** Vegetable IDs already selected in other rows */
	selectedVegIds: number[];
	/** Currently selected vegetable ID for this row */
	vegId: number | null;
	/** Per-vegetable limit / usage info (from plan-usage API) */
	limitInfo?: VegLimitInfo | null;
	/** Whether the vegetable has zero remaining and should be visually flagged */
	zeroRemaining?: boolean;
	onUpdate: (
		index: number,
		field: keyof OrderItemInput,
		value: string | number,
	) => void;
	onVegSelect: (index: number, veg: Vegetable) => void;
	onRemove: (index: number) => void;
	canRemove: boolean;
}

export default function OrderItemRow({
	index,
	item,
	vegetables,
	vegetablesLoading,
	selectedVegIds,
	vegId,
	limitInfo,
	zeroRemaining,
	onUpdate,
	onVegSelect,
	onRemove,
	canRemove,
}: OrderItemRowProps) {
	// Derive remaining qty for this specific vegetable
	const remaining =
		limitInfo && limitInfo.limit !== null
			? limitInfo.limit -
				limitInfo.used -
				limitInfo.otherRowsQty -
				item.quantity
			: null;

	const remainingBeforeThisRow =
		limitInfo && limitInfo.limit !== null
			? limitInfo.limit - limitInfo.used - limitInfo.otherRowsQty
			: null;

	const status =
		remaining !== null
			? deriveLimitStatus(limitInfo!.limit, remaining + item.quantity) // status based on remaining (excl. this row's qty)
			: "none";

	// Effective status considering this row's qty
	const effectiveStatus =
		remaining !== null
			? deriveLimitStatus(limitInfo!.limit, remaining)
			: "none";

	const isExceeded = effectiveStatus === "exceeded";
	const isWarning = effectiveStatus === "warning";

	// Border colour based on status
	const borderClass = isExceeded
		? "border-red-300 bg-red-50/30"
		: isWarning
			? "border-amber-300 bg-amber-50/30"
			: "border-gray-200";

	return (
		<div
			className={cn(
				"rounded-lg border p-3 space-y-2 transition-colors",
				borderClass,
			)}
		>
			<div className="flex items-start gap-2">
				{/* Vegetable dropdown */}
				<div className="flex-1">
					<VegetableDropdown
						id={`veg-${index}`}
						vegetables={vegetables}
						value={vegId}
						onChange={(veg) => onVegSelect(index, veg)}
						excludeIds={selectedVegIds}
						isLoading={vegetablesLoading}
					/>
				</div>

				{/* Quantity */}
				<div className="w-24 flex-shrink-0">
					<Input
						label="Qty"
						id={`qty-${index}`}
						type="number"
						min={0.1}
						step={0.1}
						max={
							remainingBeforeThisRow !== null
								? Math.max(remainingBeforeThisRow, 0)
								: undefined
						}
						value={item.quantity}
						onChange={(e) => {
							let val = Number(e.target.value);
							// Auto-cap: clamp to remaining if limit exists
							if (
								remainingBeforeThisRow !== null &&
								val > remainingBeforeThisRow
							) {
								val = Math.max(remainingBeforeThisRow, 0);
							}
							onUpdate(index, "quantity", val);
						}}
					/>
				</div>

				{/* Unit (selectable) */}
				<div className="w-24 flex-shrink-0">
					<div className="space-y-1">
						<label
							htmlFor={`unit-${index}`}
							className="block text-sm font-medium text-gray-700"
						>
							Unit
						</label>
						<select
							id={`unit-${index}`}
							value={item.unit}
							onChange={(e) => onUpdate(index, "unit", e.target.value)}
							className="flex h-[38px] w-full items-center rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
						>
							<option value="kg">kg</option>
							<option value="piece">piece</option>
						</select>
					</div>
				</div>

				{/* Remove */}
				{canRemove && (
					<button
						type="button"
						onClick={() => onRemove(index)}
						className="mt-6 flex-shrink-0 rounded-full p-1.5 text-red-500 hover:bg-red-50 transition"
						title="Remove item"
					>
						✕
					</button>
				)}
			</div>

			{/* Limit badge + warning */}
			{vegId !== null && limitInfo && (
				<div className="flex items-center gap-2 flex-wrap">
					<LimitBadge
						remaining={
							remainingBeforeThisRow !== null
								? Math.max(remainingBeforeThisRow, 0)
								: 0
						}
						unit={limitInfo.unit}
						status={
							remainingBeforeThisRow !== null
								? deriveLimitStatus(limitInfo.limit, remainingBeforeThisRow)
								: "none"
						}
					/>

					{/* Inline warning message */}
					{isExceeded && (
						<span className="text-[11px] font-medium text-red-600">
							Limit exceeded — reduce quantity
						</span>
					)}
					{isWarning && !isExceeded && remaining !== null && (
						<span className="text-[11px] font-medium text-amber-600">
							Only {Math.max(remaining, 0)} {limitInfo.unit} left
						</span>
					)}
				</div>
			)}

			{/* No-limit tooltip hint */}
			{vegId !== null && !limitInfo && (
				<span className="text-[11px] text-gray-400 italic">
					No limit set for this vegetable
				</span>
			)}
		</div>
	);
}
