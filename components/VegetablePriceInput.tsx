"use client";

import { memo } from "react";

interface VegetablePriceInputProps {
	vegId: number;
	name: string;
	hindiName?: string;
	value: string;
	originalValue: string;
	onChange: (vegId: number, value: string) => void;
	highlighted: boolean;
}

function VegetablePriceInputBase({
	vegId,
	name,
	hindiName,
	value,
	originalValue,
	onChange,
	highlighted,
}: VegetablePriceInputProps) {
	const hasExisting = originalValue !== "";
	const isChanged = value !== originalValue;
	const isEdited = hasExisting && isChanged;

	let ringCls = "";
	if (highlighted) {
		ringCls = "bg-green-50 ring-1 ring-green-200";
	} else if (isEdited) {
		ringCls = "bg-amber-50/50 ring-1 ring-amber-200";
	}

	return (
		<div
			className={`grid grid-cols-[1fr_auto] items-center gap-4 py-3 px-2 rounded-lg transition-colors ${ringCls}`}
		>
			<div className="flex flex-col">
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium text-gray-900">{name}</span>
					{hasExisting && !isChanged && (
						<span className="inline-flex items-center rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
							Already set
						</span>
					)}
					{isEdited && (
						<span className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
							Changed
						</span>
					)}
				</div>
				{hindiName && (
					<span className="text-xs text-gray-400">{hindiName}</span>
				)}
			</div>
			<div className="flex items-center gap-1.5">
				<span className="text-sm text-gray-500">₹</span>
				<input
					type="number"
					min="0.01"
					step="0.01"
					value={value}
					onChange={(e) => onChange(vegId, e.target.value)}
					placeholder="0.00"
					className="w-24 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-right focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
				/>
			</div>
		</div>
	);
}

const VegetablePriceInput = memo(VegetablePriceInputBase);
export default VegetablePriceInput;
